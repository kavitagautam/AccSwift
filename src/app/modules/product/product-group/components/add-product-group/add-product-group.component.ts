import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProductGroup } from "../../models/product-group.models";
import { ToastrService } from "ngx-toastr";
import { ProductGroupService } from "../../services/product-group.service";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-add-product-group",
  templateUrl: "./add-product-group.component.html",
  styleUrls: ["./add-product-group.component.scss"]
})
export class AddProductGroupComponent implements OnInit {
  @Input("selectedGroupId") selectedGroupId;
  @Output() onSave: Subject<boolean>;
  @Output() onCancel = new EventEmitter<boolean>();

  groupDetails: ProductGroup;
  addProductGroupForm: FormGroup;
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
    this.addProductGroupForm = this._fb.group({
      groupName: ["", Validators.required],
      parentGroupId: [
        this.groupDetails ? this.groupDetails.ParentGroupName : null,
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
    if (this.addProductGroupForm.invalid) return;
    const obj = {
      ParentID: this.addProductGroupForm.get("parentGroupId").value,
      EngName: this.addProductGroupForm.get("groupName").value,
      Remarks: this.addProductGroupForm.get("remarks").value
    };
    this.productGroupService.addProductGroup(obj).subscribe(
      response => {
        this.onSave.next(true);

        // window.location.reload();
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
