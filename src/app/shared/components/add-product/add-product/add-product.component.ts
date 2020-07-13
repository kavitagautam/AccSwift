import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  private editedRowIndex: number;

  submitted: boolean;

  rowSubmitted: boolean;
  selectedProductId: number;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  constructor(
    private _fb: FormBuilder,
    public productService: ProductService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildProductForm();
  }

  buildProductForm(): void {
    this.productForm = this._fb.group({
      productCode: ["", Validators.required],
      productName: ["", Validators.required],
      productGroupId: [null, Validators.required],
      departmentandLocationId: [null, Validators.required],
      baseUnitId: [null, Validators.required],
      isVatApplicable: [false, Validators.required],
      isDecimalApplicable: [false],
      isInventoryApplicable: [false],
      remarks: [""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      moreDetails: new FormControl(""),
    });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [""],
      productId: [""],
      accountClassId: [
        this.productService.accountClass
          ? this.productService.accountClass[0].ID
          : null,
      ],
      accountClassName: [
        this.productService.accountClass
          ? this.productService.accountClass[0].Name
          : "",
      ],
      quantity: [""],
      purchaseRate: [""],
      salesRate: [""],
      date: [""],
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.productForm.get("openingBalanceList");
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.productForm.get("openingBalanceList").invalid) return;
    (<FormArray>this.productForm.get("openingBalanceList")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.productForm.get("openingBalanceList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.productForm.get("openingBalanceList")).removeAt(rowIndex);
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  save(): void {
    if (this.productForm.invalid) return;
    const openingBalanceArray = <FormArray>(
      this.productForm.get("openingBalanceList")
    );
    const obj = {
      ProductCode: this.productForm.get("productCode").value,
      Name: this.productForm.get("productName").value,
      GroupID: this.productForm.get("productGroupId").value,
      DepotID: this.productForm.get("departmentandLocationId").value,
      UnitID: this.productForm.get("baseUnitId").value,
      IsVatApplicable: this.productForm.get("isVatApplicable").value
        ? this.productForm.get("isVatApplicable").value
        : false,
      IsInventoryApplicable: this.productForm.get("isInventoryApplicable").value
        ? this.productForm.get("isInventoryApplicable").value
        : false,
      IsDecimalApplicable: this.productForm.get("isDecimalApplicable").value
        ? this.productForm.get("isDecimalApplicable").value
        : false,
      OpeningQuantity: {
        ProductID: this.productForm.get("productGroupId").value,
        AccClassID: openingBalanceArray.controls[0].get("accountClassId").value,
        OpenPurchaseQty: openingBalanceArray.controls[0].get("quantity").value,
        OpenPurchaseRate: openingBalanceArray.controls[0].get("purchaseRate")
          .value,
        OpenSalesRate: openingBalanceArray.controls[0].get("salesRate").value,
        OpenQuantityDate: openingBalanceArray.controls[0].get("date").value,
      },
    };
    this.productService.addProduct(obj).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product added successfully");
      }
    );
  }

  cancel(event): void {
    this.buildProductForm();
  }

  formInitialized(name: string, form: FormGroup) {
    this.productForm.setControl(name, form);
  }
}
