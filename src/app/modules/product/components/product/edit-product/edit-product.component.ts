import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-edit-product",
  templateUrl: "../common-template/product.component.html",
  styleUrls: ["./edit-product.component.scss"]
})
export class EditProductComponent implements OnInit {
  @Input("selectedProductId") selectedProductId;
  @Output() onCancel = new EventEmitter<boolean>();

  private editedRowIndex: number;
  submitted: boolean;
  rowSubmitted: boolean;
  showActions = true;
  productDetails;
  productForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    public productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildProductForm();
    this.getProductDetails();
  }

  buildProductForm(): void {
    this.productForm = this._fb.group({
      productCode: [
        this.productDetails ? this.productDetails.ProductCode : "",
        Validators.required
      ],
      productName: [
        this.productDetails ? this.productDetails.Name : "",
        Validators.required
      ],
      productGroupId: [
        this.productDetails ? this.productDetails.GroupID : null,
        Validators.required
      ],
      departmentandLocationId: [
        this.productDetails ? this.productDetails.DepotID : null,
        Validators.required
      ],
      baseUnitId: [
        this.productDetails ? this.productDetails.UnitID : null,
        Validators.required
      ],
      isVatApplicable: [
        this.productDetails ? this.productDetails.IsVatApplicable : false,
        Validators.required
      ],
      isDecimalApplicable: [
        this.productDetails ? this.productDetails.IsDecimalApplicable : false
      ],
      isInventoryApplicable: [
        this.productDetails ? this.productDetails.IsInventoryApplicable : false
      ],
      remarks: [this.productDetails ? this.productDetails.Remarks : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()])
    });
  }

  getProductDetails(): void {
    if (this.selectedProductId) {
      this.productService
        .getProductDetails(this.selectedProductId)
        .subscribe(response => {
          this.productDetails = response.Entity;
          this.buildProductForm();
          this.setOpeingQuantity();
        });
    }
  }

  setOpeingQuantity(): void {
    this.productForm.setControl(
      "openingBalanceList",
      this.setOpeningBalanceFormArray(this.productDetails.OpeningQuantity)
    );
  }

  setOpeningBalanceFormArray(openingQuantities): FormArray {
    const openingQuantitiesFormArray = new FormArray([]);
    if (openingQuantities) {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [openingQuantities.AccClassID],
          productId: [openingQuantities.ProductID],
          accountClassId: [
            this.productService.accountClass
              ? this.productService.accountClass[0].ID
              : null
          ],
          accountClassName: [
            this.productService.accountClass
              ? this.productService.accountClass[0].Name
              : ""
          ],
          quantity: openingQuantities.OpenPurchaseQty,
          purchaseRate: [openingQuantities.OpenPurchaseRate],
          salesRate: [openingQuantities.OpenSalesRate],
          date: [new Date(openingQuantities.OpenQuantityDate)]
        })
      );
    } else {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [""],
          productId: [""],
          accountClassId: [
            this.productService.accountClass
              ? this.productService.accountClass[0].ID
              : null
          ],
          accountClassName: [
            this.productService.accountClass
              ? this.productService.accountClass[0].Name
              : ""
          ],
          quantity: "",
          purchaseRate: [""],
          salesRate: [""],
          date: [""]
        })
      );
    }
    return openingQuantitiesFormArray;
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [""],
      productId: [""],
      accountClassId: [
        this.productService.accountClass
          ? this.productService.accountClass[0].ID
          : null
      ],
      accountClassName: [
        this.productService.accountClass
          ? this.productService.accountClass[0].Name
          : ""
      ],
      quantity: "",
      purchaseRate: [""],
      salesRate: [""],
      date: [""]
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.productForm.get("openingBalanceList");
  }

  openModal(index: number): void {}

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.productForm.get("openingBalanceList").invalid) return;
    if (sender.data.length > 0) return;
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

  updateOpeningBalance(): void {
    const updateValue = this.productForm.get("openingBalanceList");
  }
  public saveProduct(): void {
    if (this.productForm.invalid) return;

    const openingBalanceArray = <FormArray>(
      this.productForm.get("openingBalanceList")
    );
    const obj = {
      ID: this.selectedProductId,
      ProductCode: this.productForm.get("productCode").value,
      Name: this.productForm.get("productName").value,
      GroupID: this.productForm.get("productGroupId").value,
      DepotID: this.productForm.get("departmentandLocationId").value,
      UnitID: this.productForm.get("baseUnitId").value,
      sVatApplicable: this.productForm.get("isVatApplicable").value,
      IsInventoryApplicable: this.productForm.get("isInventoryApplicable")
        .value,
      IsDecimalApplicable: this.productForm.get("isDecimalApplicable").value,
      OpeningQuantity: {
        ID: openingBalanceArray.controls[0].get("ID").value,
        ProductID: openingBalanceArray.controls[0].get("productId").value,
        AccClassID: openingBalanceArray.controls[0].get("accountClassId").value,
        OpenPurchaseQty: openingBalanceArray.controls[0].get("quantity").value,
        OpenPurchaseRate: openingBalanceArray.controls[0].get("purchaseRate")
          .value,
        OpenSalesRate: openingBalanceArray.controls[0].get("salesRate").value,
        OpenQuantityDate: openingBalanceArray.controls[0].get("date").value
      }
    };
    this.productService.updateProduct(obj).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product added successfully");
      }
    );
  }

  public cancelProduct(): void {
    //execute callback to the viewProductGroupComponent
    this.onCancel.emit(true);
  }
}
