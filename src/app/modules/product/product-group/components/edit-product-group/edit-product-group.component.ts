import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ProductGroupService } from "../../services/product-group.service";
import { ProductGroup } from "../../models/product-group.models";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-edit-product-group",
  templateUrl: "./edit-product-group.component.html",
  styleUrls: ["./edit-product-group.component.scss"]
})
export class EditProductGroupComponent implements OnInit {
  @Input("selectedGroupId") selectedGroupId;
  groupDetails: ProductGroup;
  editProductGroupForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public productGroupService: ProductGroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
  }

  buildProductGroupForm(): void {
    this.editProductGroupForm = this._fb.group({
      groupName: [this.groupDetails ? this.groupDetails.EngName : ""],
      parentGroupId: [this.groupDetails ? this.groupDetails.ParentID : 0],
      remarks: [this.groupDetails ? this.groupDetails.Remarks : ""]
    });
  }

  getGroupDetails(): void {
    this.productGroupService
      .getProductGroupDetails(this.selectedGroupId)
      .subscribe(response => {
        this.groupDetails = response.Entity;
        this.buildProductGroupForm();
      });
  }
  save(): void {
    if (this.editProductGroupForm.invalid) return;
    const obj = {
      ID: this.groupDetails.ID,
      ParentID: this.editProductGroupForm.get("parentGroupId").value,
      EngName: this.editProductGroupForm.get("groupName").value,
      Remarks: this.editProductGroupForm.get("remarks").value
    };
    this.productGroupService.updateProductGroup(obj).subscribe(
      response => {
        window.location.reload();
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product Group edited successfully");
      }
    );
  }

  cancel(): void {}
}
