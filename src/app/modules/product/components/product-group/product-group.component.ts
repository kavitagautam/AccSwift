import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";

import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { ProductGroupService } from "../../services/product-group.service";
import { ProductGroup } from "../../models/product.models";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "accSwift-product-group",
  templateUrl: "./product-group.component.html",
  styleUrls: ["./product-group.component.scss"]
})
export class ProductGroupComponent implements OnInit, OnChanges {
  @Input("selectedProductGroup") selectedProductGroup;
  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  title: string;
  editMode: boolean = false;
  addMode: boolean;
  selectedGroupId: number;

  constructor(
    private modalService: BsModalService,
    public productGroupService: ProductGroupService,
    private toastr: ToastrService,
    public _fb: FormBuilder
  ) {}

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  ngOnInit() {
    this.buildProductGroupForm();
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

  //Detect the changes in tree selection of product group with ngOnChanges
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const log: string[] = [];
    for (const selectedProductGroup in changes) {
      const change = changes[selectedProductGroup];
      this.selectedProductGroup = change.currentValue;
      this.selectedGroupId = this.selectedProductGroup.ID;
    }
    if (this.selectedGroupId) {
      this.editMode = true;
      this.addMode = false;
      this.title = "Edit ";
      this.getGroupDetails();
    } else {
      this.addProductGroup();
    }
  }

  getGroupDetails(): void {
    if (this.selectedGroupId) {
      this.productGroupService
        .getProductGroupDetails(this.selectedGroupId)
        .subscribe(res => {
          this.groupDetails = res.Entity;
          this.buildProductGroupForm();
        });
    }
  }

  addProductGroup(): void {
    this.groupDetails = null;
    this.editMode = false;
    this.addMode = true;
    this.title = "Add Product Group ";
    this.buildProductGroupForm();
  }

  save(): void {
    if (this.addMode) {
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
    } else {
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
  }

  cancel(event): void {
    this.groupDetails = null;
    this.buildProductGroupForm();
  }

  public deleteProductGroupByID(id): void {
    this.productGroupService.deleteProductGroupByID(id).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product Group deleted successfully");
      }
    );
  }

  deleteProductGroup(): void {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "product group";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteProductGroupByID(this.selectedGroupId);
      }
    });
  }
}
