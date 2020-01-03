import { FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add-sales-invoice.component.html',
  styleUrls: ['./add-sales-invoice.component.scss']
})
export class AddSalesInvoiceComponent implements OnInit {
  addSalesInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  private editedRowIndex: number;


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.buildEditSalesInvoiceForm();
  }


  buildEditSalesInvoiceForm() {
    this.addSalesInvoiceForm = this.fb.group({
      series: [""],
      cashParty: [""],
      sales: [""],
      depot: [""],
      project: [""],
      date: [new Date()],
      orderNo: [""],
      salesInvoiceEntryList: this.fb.array([this.addSalesInvoiceEntryFormGroup()])
    });
  }

  addSalesInvoiceEntryFormGroup(): FormGroup {
    return this.fb.group({
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
    if (this.addSalesInvoiceForm.valid) {
      this.router.navigate(["/sales-invoice"]);
    }
  }

  public cancel(): void {
    this.addSalesInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getSalesInvoiceEntryList(): FormArray {
    return <FormArray>this.addSalesInvoiceForm.get("salesInvoiceEntryList");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const salesInvoiceEntry = <FormArray>(
      this.addSalesInvoiceForm.get("salesInvoiceEntryList")
    );
    if (salesInvoiceEntry.invalid) return;
    (<FormArray>this.addSalesInvoiceForm.get("salesInvoiceEntryList")).push(
      this.addSalesInvoiceEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesInvoiceEntry = <FormArray>(
      this.addSalesInvoiceForm.get("salesInvoiceEntryList")
    );
    salesInvoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    salesInvoiceEntry.controls[rowIndex].get("productName").setValue(dataItem.productName);
    salesInvoiceEntry.controls[rowIndex].get("quantity").setValue(dataItem.quantity);
    salesInvoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    salesInvoiceEntry.controls[rowIndex].get("purchaseRate").setValue(dataItem.purchaseRate);
    salesInvoiceEntry.controls[rowIndex].get("amount").setValue(dataItem.amount);
    salesInvoiceEntry.controls[rowIndex].get("specialDiscount").setValue(dataItem.specialDiscount);
    salesInvoiceEntry.controls[rowIndex].get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    salesInvoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    salesInvoiceEntry.controls[rowIndex].get("customDuty").setValue(dataItem.customDuty);
    salesInvoiceEntry.controls[rowIndex].get("freight").setValue(dataItem.freight);
    salesInvoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    salesInvoiceEntry.controls[rowIndex].get("tcAmount").setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.addSalesInvoiceForm.get("salesInvoiceEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addSalesInvoiceForm.get("salesInvoiceEntryList")).removeAt(
      rowIndex
    );
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
