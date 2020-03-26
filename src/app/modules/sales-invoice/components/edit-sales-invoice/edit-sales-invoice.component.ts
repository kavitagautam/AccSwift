import { SalseInvoice } from "./../models/sales-invoice.model";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-edit-sales-invoice",
  templateUrl: "./edit-sales-invoice.component.html",
  styleUrls: ["./edit-sales-invoice.component.scss"]
})
export class EditSalesInvoiceComponent implements OnInit {
  editInvoiceForm: FormGroup;
  salesDetails: SalseInvoice;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public salesInvoiceService: SalesInvoiceService
  ) {}

  ngOnInit() {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  buildEditInvoiceForm() {
    this.editInvoiceForm = this._fb.group({
      SeriesID: this.salesDetails ? this.salesDetails.SeriesID : null,
      CashPartyLedgerID: this.salesDetails
        ? [this.salesDetails.CashPartyLedgerID, [Validators.required]]
        : null,
      SalesLedgerID: [
        this.salesDetails ? this.salesDetails.SalesLedgerID : null,
        [Validators.required]
      ],
      DepotID: [this.salesDetails ? this.salesDetails.DepotID : null],
      ProjectID: [this.salesDetails ? this.salesDetails.ProjectID : null],
      Date: [this.salesDetails ? new Date(this.salesDetails.CreatedDate) : ""],
      OrderNo: this.salesDetails
        ? this.salesDetails.OrderNo
        : ["", [Validators.required]],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()])
    });
  }

  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      const param = params.get("id");
      if (param) {
        this.salesInvoiceService
          .getSalesInvoiceDetails(param)
          .subscribe(response => {
            this.salesDetails = response.Entity;
            this.buildEditInvoiceForm();
            this.setInvoiceList();
          });
      }
    });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ProductCode: [""],
      ProductName: [""],
      Quantity: [""],
      QtyUnitID: [""],
      SalesRate: [""],
      Amount: [""],
      DiscPercentage: [""],
      DiscountAmount: [""],
      NetAmount: [""],
      TaxID: [""],
      TaxAmount: [""]
    });
  }

  setInvoiceList(): void {
    this.editInvoiceForm.setControl(
      "InvoiceDetails",
      this.setInvoiceDetailsFormArray(this.salesDetails.InvoiceDetails)
    );
  }

  // this block of code is used to show form array data in the template.....
  setInvoiceDetailsFormArray(invoiceDetails): FormArray {
    const journalFormArray = new FormArray([]);
    if (invoiceDetails && invoiceDetails.length > 0) {
      invoiceDetails.forEach(element => {
        journalFormArray.push(
          this._fb.group({
            ProductCode: [element.ProductCode],
            ProductName: [element.ProductName],
            Quantity: [element.Quantity],
            QtyUnitID: [element.QtyUnitID],
            SalesRate: [element.SalesRate],
            Amount: [element.Amount],
            DiscPercentage: [element.DiscPercentage],
            DiscountAmount: [element.DiscountAmount],
            NetAmount: [element.NetAmount],
            TaxID: [element.TaxID],
            TaxAmount: [element.TaxAmount]
          })
        );
      });
    } else {
      journalFormArray.push(
        this._fb.group({
          ProductCode: [""],
          ProductName: [""],
          Quantity: [""],
          QtyUnitID: [""],
          SalesRate: [""],
          Amount: [""],
          DiscPercentage: [""],
          DiscountAmount: [""],
          NetAmount: [""],
          TaxID: [""],
          TaxAmount: [""]
        })
      );
    }
    return journalFormArray;
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
    return <FormArray>this.editInvoiceForm.get("InvoiceDetails");
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
    // const invoiceEntry = <FormArray>(
    //   this.editInvoiceForm.get("invoiceEntryList")
    // );
    // invoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    // invoiceEntry.controls[rowIndex]
    //   .get("productName")
    //   .setValue(dataItem.productName);
    // invoiceEntry.controls[rowIndex].get("quantity").setValue(dataItem.quantity);
    // invoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    // invoiceEntry.controls[rowIndex]
    //   .get("purchaseRate")
    //   .setValue(dataItem.purchaseRate);
    // invoiceEntry.controls[rowIndex].get("amount").setValue(dataItem.amount);
    // invoiceEntry.controls[rowIndex]
    //   .get("specialDiscount")
    //   .setValue(dataItem.specialDiscount);
    // invoiceEntry.controls[rowIndex]
    //   .get("specialDiscounts")
    //   .setValue(dataItem.specialDiscounts);
    // invoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    // invoiceEntry.controls[rowIndex]
    //   .get("customDuty")
    //   .setValue(dataItem.customDuty);
    // invoiceEntry.controls[rowIndex].get("freight").setValue(dataItem.freight);
    // invoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    // invoiceEntry.controls[rowIndex].get("tcAmount").setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editInvoiceForm.get("invoiceEntryList"));
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
