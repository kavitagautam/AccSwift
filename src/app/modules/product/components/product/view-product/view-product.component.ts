import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";

@Component({
  selector: "accSwift-view-product",
  templateUrl: "../common-template/product.component.html",
  styleUrls: ["./view-product.component.scss"]
})
export class ViewProductComponent implements OnInit {
  @Input("selectedProductId") selectedProductId;
  private editedRowIndex: number;
  submitted: boolean;
  showActions = false;

  rowSubmitted: boolean;
  productDetails;
  productForm: FormGroup;
  constructor(public _fb: FormBuilder, public productService: ProductService) {}

  ngOnInit() {
    this.getProductDetails();
    this.buildProductForm();
  }

  //  console.log(
  //   "dsadas Opening Balance" +
  //     JSON.stringify(this.productForm.get("openingBalanceList").value)
  // );
  buildProductForm(): void {
    this.productForm = this._fb.group({
      productCode: [
        {
          value: this.productDetails ? this.productDetails.ProductCode : "",
          disabled: true
        },
        Validators.required
      ],
      productName: [
        {
          value: this.productDetails ? this.productDetails.Name : "",
          disabled: true
        },
        Validators.required
      ],
      productGroupId: [
        {
          value: this.productDetails ? this.productDetails.GroupID : null,
          disabled: true
        },
        Validators.required
      ],
      departmentandLocationId: [
        {
          value: this.productDetails ? this.productDetails.DepotID : null,
          disabled: true
        },
        Validators.required
      ],
      baseUnitId: [
        {
          value: this.productDetails ? this.productDetails.UnitID : null,
          disabled: true
        },
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
      remarks: [
        {
          value: this.productDetails ? this.productDetails.Remarks : "",
          disabled: true
        }
      ],
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
    if (openingQuantities) {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [openingQuantities.ID],
          productId: [openingQuantities.ProductID],
          accountClassId: [openingQuantities.AccClassID, Validators.required],
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
}
