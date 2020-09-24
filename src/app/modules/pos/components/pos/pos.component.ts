import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  productOrGroupList: ProductOrGroup[] = [];
  form: FormGroup;
  private editedRowIndex: number;

  constructor(private posServices: PosService, private _fb: FormBuilder) {
    this.form = this._fb.group({
      products: this._fb.array([]),
    });
    // [this.addNewProduct()]
  }

  addNewProduct(): FormGroup {
    return this._fb.group({
      PurchaseRate: [""],
      SalesRate: [""],
      ClosingQty: [""],
      QtyUnitID: [""],
      Quantity: [null],
      IsInventory: [""],
      IsVAT: [""],
      TaxID: [""],
      Amount: [0],
      CodeName: [""],
      ID: [""],
      TypeOf: [""],
      Title: [""],
    });
  }

  get getProduct() {
    return this.form.get("products") as FormArray;
  }

  // get formArr() {
  //   return this.accountForm.get("sports") as FormArray;
  // }
  ngOnInit() {
    this.getProductGroup();
  }

  getProductGroup(): void {
    this.posServices.getProductOrGroup(null).subscribe((response) => {
      this.productOrGroupList = response.Entity;
    });
  }

  productClick(product): void {
    if (product.TypeOf == 0) {
      this.posServices.getProductOrGroup(product.ID).subscribe((response) => {
        this.productOrGroupList = response.Entity;
      });
    }
    if (product.TypeOf == 1) {
      const creds = this.form.controls.products as FormArray;
      creds.push(
        this._fb.group({
          PurchaseRate: [product.PurchaseRate],
          SalesRate: [product.SalesRate],
          ClosingQty: [product.ClosingQty],
          QtyUnitID: [product.QtyUnitID],
          Quantity: [1],
          IsInventory: [product.IsInventory],
          IsVAT: [product.IsVAT],
          TaxID: [product.TaxID],
          Amount: [0],
          CodeName: [product.CodeName],
          ID: [product.ID],
          TypeOf: [product.TypeOf],
          Title: [product.Title],
        })
      );
    }
  }

  quantityValues(dataItem, index): void {
    const productListArray = this.form.get("products") as FormArray;
    let qunatityValue = productListArray.controls[index].get("Quantity").value;
    let salesRate = productListArray.controls[index].get("SalesRate").value;
    productListArray.controls[index]
      .get("Amount")
      .setValue(qunatityValue * salesRate);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.form.get("products"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const productListArray = this.form.get("products") as FormArray;
    // Remove the Row
    productListArray.removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
