import { SalesInvoiceMaster } from './../models/sales-invoice.model';
import { SalesInvoiceService } from './../../services/sales-invoice.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'accSwift-edit-sales-invoice',
  templateUrl: './edit-sales-invoice.component.html',
  styleUrls: ['./edit-sales-invoice.component.scss']
})
export class EditSalesInvoiceComponent implements OnInit {
  editInvoiceForm: FormGroup;
  salesDetails: SalesInvoiceMaster;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, public salesInvoiceService: SalesInvoiceService) { }

  ngOnInit() {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }


  buildEditInvoiceForm() {
    this.editInvoiceForm = this._fb.group({
      seriesId: [this.salesDetails ? this.salesDetails.SeriesID : 0],
      cashPartyACId: [this.salesDetails ? this.salesDetails.CashPartyLedgerID : 0],
      salesACId: [this.salesDetails ? this.salesDetails.SalesLedgerID : 0],
      depotLocationId: [this.salesDetails ? this.salesDetails.DepotID : 0],
      projectId: [this.salesDetails ? this.salesDetails.ProjectID : 0],
      date: [this.salesDetails ? new Date(this.salesDetails.CreatedDate) : ""],
      orderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
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

  // Get id from route
  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('id');
      if (param) {
        this.salesInvoiceService.getSalesInvoiceDetails(param).subscribe(res => {
          this.salesDetails = res;
          this.buildEditInvoiceForm();
        })
      }
    })
  }

  public save(): void {
    if (this.editInvoiceForm.valid) {
      this.router.navigate(["/sales-invoice"]);
    }
  }

  public cancel(): void {
    this.editInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.editInvoiceForm.get("invoiceEntryList");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>(
      this.editInvoiceForm.get("invoiceEntryList")
    );
    if (invoiceEntry.invalid) return;
    (<FormArray>this.editInvoiceForm.get("invoiceEntryList")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const invoiceEntry = <FormArray>(
      this.editInvoiceForm.get("invoiceEntryList")
    );
    invoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    invoiceEntry.controls[rowIndex].get("productName").setValue(dataItem.productName);
    invoiceEntry.controls[rowIndex].get("quantity").setValue(dataItem.quantity);
    invoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    invoiceEntry.controls[rowIndex].get("purchaseRate").setValue(dataItem.purchaseRate);
    invoiceEntry.controls[rowIndex].get("amount").setValue(dataItem.amount);
    invoiceEntry.controls[rowIndex].get("specialDiscount").setValue(dataItem.specialDiscount);
    invoiceEntry.controls[rowIndex].get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    invoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    invoiceEntry.controls[rowIndex].get("customDuty").setValue(dataItem.customDuty);
    invoiceEntry.controls[rowIndex].get("freight").setValue(dataItem.freight);
    invoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    invoiceEntry.controls[rowIndex].get("tcAmount").setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editInvoiceForm.get("invoiceEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editInvoiceForm.get("invoiceEntryList")).removeAt(
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
