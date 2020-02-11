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
  rowSubmitted: boolean;
  productDetails;
  productForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getProductDetails();
    this.buildProductForm();
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
      productGroup: [
        this.productDetails ? this.productDetails.GroupName : "",
        Validators.required
      ],
      departmentandLocation: [""],
      baseUnit: [
        this.productDetails ? this.productDetails.UnitMaintenanceID : "",
        Validators.required
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
      });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      accountClass: [""],
      openingBalance: [""],
      balanceType: [""]
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
