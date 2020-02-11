import { Component, OnInit, Input } from "@angular/core";
import { ProductGroup } from "../../models/product-group.models";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductGroupService } from "../../services/product-group.service";

@Component({
  selector: "accSwift-view-product-group",
  templateUrl: "../common-template/product-group.component.html",
  styleUrls: ["./view-product-group.component.scss"]
})
export class ViewProductGroupComponent implements OnInit {
  @Input("selectedGroupId") selectedGroupId;
  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productGroupService: ProductGroupService
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
    if (this.selectedGroupId) {
      this.getGroupDetails();
    }
  }

  buildProductGroupForm(): void {
    this.productGroupForm = this._fb.group({
      groupName: [this.groupDetails ? this.groupDetails.Name : ""],
      parentGroup: [this.groupDetails ? this.groupDetails.ParentGroupName : ""],
      remarks: [this.groupDetails ? this.groupDetails.Remarks : ""]
    });
  }

  getGroupDetails(): void {
    this.productGroupService
      .getProductGroupDetails(this.selectedGroupId)
      .subscribe(res => {
        this.groupDetails = res.Entity;
        this.buildProductGroupForm();
      });
  }
}
