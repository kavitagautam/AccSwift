import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";

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
  constructor(public _fb: FormBuilder, public productService: ProductService) {}

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
    this.productService
      .getProductDetails(this.selectedProductId)
      .subscribe(response => {
        this.productDetails = response.Entity;
        this.buildProductForm();
        this.setOpeingQuantity();
      });
  }

  setOpeingQuantity(): void {
    this.productForm.setControl(
      "openingBalanceList",
      this.setOpeningBalanceFormArray(this.productDetails.OpeningQuantity)
    );
  }

  setOpeningBalanceFormArray(openingQuantities): FormArray {
    const openingQuantitiesFormArray = new FormArray([]);
    if (openingQuantities && openingQuantities.length > 0) {
      openingQuantities.forEach(element => {
        openingQuantitiesFormArray.push(
          this._fb.group({
            ID: [element.AccClassID],
            productId: [element.ProductID],
            accountClassId: [element.AccClassID, Validators.required],
            quantity: element.OpenPurchaseQty,
            purchaseRate: [element.OpenPurchaseRate],
            salesRate: [element.OpenSalesRate],
            date: [new Date(element.OpenQuantityDate)]
          })
        );
      });
    } else {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [""],
          productId: [""],
          accountClassId: ["", Validators.required],
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
      accountClassId: ["", Validators.required],
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

  public saveProduct() {
    if (this.productForm.invalid) return;
  }

  cancel(): void {
    //execute callback to the viewProductGroupComponent
    this.onCancel.emit(true);
  }
}
