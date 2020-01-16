import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormArray } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-add-sales-invoice",
  templateUrl: "./add-sales-invoice.component.html",
  styleUrls: ["./add-sales-invoice.component.scss"]
})
export class AddSalesInvoiceComponent implements OnInit {
  addInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  private editedRowIndex: number;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public salesInvoiceService: SalesInvoiceService
  ) {}

  ngOnInit() {
    this.buildAddSalesInvoiceForm();
  }

  buildAddSalesInvoiceForm() {
    this.addInvoiceForm = this._fb.group({
      seriesId: [0],
      cashPartyACId: [0],
      salesACId: [0],
      depotLocationId: [0],
      projectId: [0],
      date: [""],
      orderNo: [""],
      invoiceEntryList: this._fb.array([this.addInvoiceEntryList()])
    });
  }

  addInvoiceEntryList(): FormGroup {
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
    });
  }

  public save(): void {
    if (this.addInvoiceForm.valid) {
      this.router.navigate(["/sales-invoice"]);
    }
  }

  public cancel(): void {
    this.addInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.addInvoiceForm.get("invoiceEntryList");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>this.addInvoiceForm.get("invoiceEntryList");
    if (invoiceEntry.invalid) return;
    (<FormArray>this.addInvoiceForm.get("invoiceEntryList")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const invoiceEntry = <FormArray>this.addInvoiceForm.get("invoiceEntryList");
    invoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    invoiceEntry.controls[rowIndex]
      .get("productName")
      .setValue(dataItem.productName);
    invoiceEntry.controls[rowIndex].get("quantity").setValue(dataItem.quantity);
    invoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    invoiceEntry.controls[rowIndex]
      .get("purchaseRate")
      .setValue(dataItem.purchaseRate);
    invoiceEntry.controls[rowIndex].get("amount").setValue(dataItem.amount);
    invoiceEntry.controls[rowIndex]
      .get("specialDiscount")
      .setValue(dataItem.specialDiscount);
    invoiceEntry.controls[rowIndex]
      .get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    invoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    invoiceEntry.controls[rowIndex]
      .get("customDuty")
      .setValue(dataItem.customDuty);
    invoiceEntry.controls[rowIndex].get("freight").setValue(dataItem.freight);
    invoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    invoiceEntry.controls[rowIndex].get("tcAmount").setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addInvoiceForm.get("invoiceEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addInvoiceForm.get("invoiceEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
