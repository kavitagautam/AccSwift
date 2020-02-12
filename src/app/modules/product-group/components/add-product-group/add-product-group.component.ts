import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProductGroup } from "../../models/product-group.models";
import { ToastrService } from "ngx-toastr";
import { ProductGroupService } from "../../services/product-group.service";

@Component({
  selector: "accSwift-add-product-group",
  templateUrl: "../common-template/product-group.component.html",
  styleUrls: ["./add-product-group.component.scss"]
})
export class AddProductGroupComponent implements OnInit {
  @Input("selectedGroupId") selectedGroupId;
  @Output() onCancel = new EventEmitter<boolean>();
  showActions = true;

  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public productGroupService: ProductGroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
    if (this.selectedGroupId) {
      this.getGroupDetails();
    }
  }

  buildProductGroupForm(): void {
    this.productGroupForm = this._fb.group({
      groupName: ["", Validators.required],
      parentGroupId: [
        this.groupDetails ? this.groupDetails.ParentGroupID : null,
        Validators.required
      ],
      remarks: [""]
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
      ParentGroupID: this.productGroupForm.get("parentGroupId").value,
      Name: this.productGroupForm.get("groupName").value,
      Remarks: this.productGroupForm.get("remarks").value
    };
    this.productGroupService.addProductGroup(obj).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product Group added successfully");
      }
    );
  }

  cancel(): void {
    //execute callback to the viewProductGroupComponent
    this.onCancel.emit(true);
  }
}
