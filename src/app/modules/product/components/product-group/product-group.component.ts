import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ProductGroup } from "../../models/product.models";
@Component({
  selector: "accSwift-product-group",
  templateUrl: "./product-group.component.html",
  styleUrls: ["./product-group.component.scss"]
})
export class ProductGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  selectedGroupId: number;
  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productService: ProductService
  ) { }

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
  saveProduct(): void {
    if (this.productGroupForm.invalid) return;

  }
  cancelProduct(): void { }
}
