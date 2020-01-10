import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ProductService } from "../../services/product.service";
import { Product } from '../../models/product.models';

@Component({
  selector: "accSwift-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  private editedRowIndex: number;
  submitted: boolean;
  rowSubmitted: boolean;
  selectedProductId: number;
  productDetails: Product;
  productForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.buildProductForm();
  }

  buildProductForm(): void {
    this.productForm = this._fb.group({
      productCode: [this.productDetails ? this.productDetails.Code : "", Validators.required],
      productName: [this.productDetails ? this.productDetails.EngName : "", Validators.required],
      productGroup: [this.productDetails ? this.productDetails.GroupName : "", Validators.required],
      departmentandLocation: [""],
      baseUnit: [this.productDetails ? this.productDetails.UnitMaintenanceID : "", Validators.required],
      remarks: [this.productDetails ? this.productDetails.Remarks : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedProductId = this.selectedItem.ID;
    }

    if (this.selectedProductId) {
      this.getProductDetails();
    }
  }


  getProductDetails(): void {
    this.productService.getProductDetails(this.selectedProductId).subscribe(res => {
      this.productDetails = res;
      this.buildProductForm();
    })
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

  openModal(index: number): void { }

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
    (<FormArray>this.productForm.get("openingBalanceList")).removeAt(
      rowIndex
    );
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public saveProduct() {
    if (this.productForm.invalid) return;
  }
}
