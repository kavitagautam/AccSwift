import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ProductGroupService } from "../../services/product-group.service";
import { ProductGroup } from "../../models/product-group.models";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-edit-product-group",
  templateUrl: "../common-template/product-group.component.html",
  styleUrls: ["./edit-product-group.component.scss"]
})
export class EditProductGroupComponent implements OnInit {
  @Input("selectedGroupId") selectedGroupId;
  @Output() onCancel = new EventEmitter<boolean>();

  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  showActions = true;

  constructor(
    private _fb: FormBuilder,
    public productGroupService: ProductGroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
    this.getGroupDetails();
  }

  buildProductGroupForm(): void {
    this.productGroupForm = this._fb.group({
      groupName: [
        this.groupDetails ? this.groupDetails.Name : "",
        Validators.required
      ],
      parentGroupId: [
        this.groupDetails ? this.groupDetails.ParentGroupID : null,
        Validators.required
      ],
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
    if (this.productGroupForm.invalid) return;
    const obj = {
      ID: this.groupDetails.ID,
      ParentGroupID: this.productGroupForm.get("parentGroupId").value,
      Name: this.productGroupForm.get("groupName").value,
      Remarks: this.productGroupForm.get("remarks").value
    };
    this.productGroupService.updateProductGroup(obj).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product Group edited successfully");
      }
    );
  }

  cancel(): void {
    //execute callback to the viewProductGroupComponent
    this.onCancel.emit(true);
  }
}
