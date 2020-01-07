import { SalesInvoiceMaster } from './../models/sales-invoice.model';
import { SalesInvoiceService } from './../../services/sales-invoice.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-sales-invoice',
  templateUrl: './edit-sales-invoice.component.html',
  styleUrls: ['./edit-sales-invoice.component.scss']
})
export class EditSalesInvoiceComponent implements OnInit {
  editSalesInvoiceForm: FormGroup;
  salesDetails: SalesInvoiceMaster;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, public salesInvoiceService: SalesInvoiceService) { }

  ngOnInit() {
    this.buildEditSalesInvoiceForm();
    this.getRouteFromParams();
  }


  buildEditSalesInvoiceForm() {
    this.editSalesInvoiceForm = this.fb.group({
      seriesId: [this.salesDetails ? this.salesDetails.SeriesID : 0],
      cashPartyACId: [this.salesDetails ? this.salesDetails.CashPartyLedgerID : 0],
      salesACId: [this.salesDetails ? this.salesDetails.SalesLedgerID : 0],
      depotLocationId: [this.salesDetails ? this.salesDetails.DepotID : 0],
      projectId: [this.salesDetails ? this.salesDetails.ProjectID : 0],
      date: [this.salesDetails ? new Date(this.salesDetails.CreatedDate) : ""],
      orderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
      salesInvoiceEntryList: this.fb.array([this.editSalesInvoiceEntryFormGroup()])
    });
  }

  editSalesInvoiceEntryFormGroup(): FormGroup {
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

  getRouteFromParams() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('id');
      if (param) {
        this.salesInvoiceService.getSalesInvoiceDetails(param).subscribe(res => {
          this.salesDetails = res;
          this.buildEditSalesInvoiceForm();
        })
      }
    })
  }

  public save(): void {
    if (this.editSalesInvoiceForm.valid) {
      this.router.navigate(["/sales-invoice"]);
    }
  }

  public cancel(): void {
    this.editSalesInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getSalesInvoiceEntryList(): FormArray {
    return <FormArray>this.editSalesInvoiceForm.get("salesInvoiceEntryList");
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
      this.editSalesInvoiceForm.get("salesInvoiceEntryList")
    );
    if (salesInvoiceEntry.invalid) return;
    (<FormArray>this.editSalesInvoiceForm.get("salesInvoiceEntryList")).push(
      this.editSalesInvoiceEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesInvoiceEntry = <FormArray>(
      this.editSalesInvoiceForm.get("salesInvoiceEntryList")
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
      this.editSalesInvoiceForm.get("salesInvoiceEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editSalesInvoiceForm.get("salesInvoiceEntryList")).removeAt(
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
