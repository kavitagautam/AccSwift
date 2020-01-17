import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  OnChanges
} from "@angular/core";
import { ProductGroup } from "../../models/product-group.models";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";

@Component({
  selector: "accSwift-view-product-group",
  templateUrl: "./view-product-group.component.html",
  styleUrls: ["./view-product-group.component.scss"]
})
export class ViewProductGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  selectedGroupId: number;
  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedGroupId = this.selectedItem.ID;
    }
    if (this.selectedGroupId) {
      this.getGroupDetails();
    }
  }

  buildProductGroupForm(): void {
    this.productGroupForm = this._fb.group({
      groupName: [this.groupDetails ? this.groupDetails.EngName : ""],
      parentGroup: [this.groupDetails ? this.groupDetails.ParentGroupName : ""],
      remarks: [this.groupDetails ? this.groupDetails.Remarks : ""]
    });
  }

  getGroupDetails(): void {
    this.productService
      .getProductGroupDetails(this.selectedGroupId)
      .subscribe(res => {
        this.groupDetails = res;
        this.buildProductGroupForm();
      });
  }
}
