import { Router } from '@angular/router';
import { SalesReturnService } from './../../services/sales-return.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'accSwift-add-sales-return',
  templateUrl: './add-sales-return.component.html',
  styleUrls: ['./add-sales-return.component.scss']
})
export class AddSalesReturnComponent implements OnInit {
  addSalesReturnForm: FormGroup;
  editedRowIndex: number;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(private _fb: FormBuilder, public addSalesRetService: SalesReturnService, private router: Router) { }

  ngOnInit() {
    this.buildAddSalesReturnForm();
  }

  buildAddSalesReturnForm() {
    this.addSalesReturnForm = this._fb.group({
      seriesId: [0],
      cashPartyACId: [0],
      salesACId: [0],
      depotLocationId: [0],
      projectId: [0],
      date: [new Date()],
      orderNo: [""],
      remarks: [""],
      salesReturnEntryList: this._fb.array([this.addSalesReturnEntryList()])
    })
  }

  addSalesReturnEntryList(): FormGroup {
    return this._fb.group({
      code: [""],
      productName: [""],
      quantity: [""],
      unit: [""],
      purchaseRate: [""],
      amount: [""],
      specialDiscount: [""],
      specialDiscounts: [""],
      netAmount: [""],
      vat: [""],
      customDuty: [""],
      customDutyAmt: [""],
      freight: [""],
      tc: [""],
      tcAmount: [""]
    })
  }

  get getSalesReturnEntryList() {
    return this.addSalesReturnForm.get("salesReturnEntryList");
  }

  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  }

  public save(): void {
    if (this.addSalesReturnForm.valid) {
      this.router.navigate(["/sales-return"]);
    }
  }

  public cancel(): void {
    this.addSalesReturnForm.reset();
    this.router.navigate(["/sales-return"]);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    //this.formGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const salesReturnEntry = <FormArray>(this.addSalesReturnForm.get("salesReturnEntryList"));
    if (salesReturnEntry.invalid) return;
    (<FormArray>salesReturnEntry).push(this.addSalesReturnEntryList());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesReturnEntry = <FormArray>(this.addSalesReturnForm.get("salesReturnEntryList"));
    salesReturnEntry.controls[rowIndex].get("ProductName").setValue(dataItem.ProductName);
    salesReturnEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    salesReturnEntry.controls[rowIndex].get("PurchaseRate").setValue(dataItem.PurchaseRate);
    salesReturnEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    salesReturnEntry.controls[rowIndex].get("NetAmount").setValue(dataItem.NetAmount);
    salesReturnEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addSalesReturnForm.get("salesReturnEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addSalesReturnForm.get("salesReturnEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
