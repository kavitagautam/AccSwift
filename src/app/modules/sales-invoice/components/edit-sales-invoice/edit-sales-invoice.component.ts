import { SalseInvoice } from "./../models/sales-invoice.model";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModelPopupComponent } from "@app/shared/component/product-model-popup/product-model-popup.component";

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
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg"
  };
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  buildEditInvoiceForm() {
    this.editInvoiceForm = this._fb.group({
      SeriesID: this.salesDetails ? this.salesDetails.SeriesID : "",
      VoucherNo: [
        this.salesDetails ? this.salesDetails.VoucherNo : null,
        Validators.required
      ],
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
      OrderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
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
      ProductID: ["", Validators.required],
      ProductName: ["", Validators.required],
      Quantity: ["", Validators.required],
      QtyUnitID: ["", Validators.required],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
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
    const invoiceFormArray = new FormArray([]);
    if (invoiceDetails && invoiceDetails.length > 0) {
      invoiceDetails.forEach(element => {
        invoiceFormArray.push(
          this._fb.group({
            ProductCode: [element.ProductCode],
            ProductName: [element.ProductName, Validators.required],
            ProductID: [element.ProductID, Validators.required],
            Quantity: [element.Quantity, Validators.required],
            QtyUnitID: [element.QtyUnitID, Validators.required],
            SalesRate: [element.SalesRate, Validators.required],
            Amount: [element.Amount, Validators.required],
            DiscPercentage: [element.DiscPercentage, Validators.required],
            DiscountAmount: [element.DiscountAmount, Validators.required],
            NetAmount: [element.NetAmount, Validators.required],
            TaxID: [element.TaxID],
            TaxAmount: [element.TaxAmount]
          })
        );
      });
    } else {
      invoiceFormArray.push(
        this._fb.group({
          ProductCode: [""],
          ProductName: ["", Validators.required],
          ProductID: [null, Validators.required],
          Quantity: ["", Validators.required],
          QtyUnitID: [null, Validators.required],
          SalesRate: ["", Validators.required],
          Amount: ["", Validators.required],
          DiscPercentage: [0, Validators.required],
          DiscountAmount: [0, Validators.required],
          NetAmount: [0, Validators.required],
          TaxID: [null],
          TaxAmount: [""]
        })
      );
    }
    return invoiceFormArray;
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

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const invoiceEntryArray = <FormArray>(
          this.editInvoiceForm.get("InvoiceDetails")
        );
        invoiceEntryArray.controls[index]
          .get("ProductCode")
          .setValue(data.Code);
        invoiceEntryArray.controls[index].get("ProductID").setValue(data.ID);
        invoiceEntryArray.controls[index]
          .get("ProductName")
          .setValue(data.Name);
        invoiceEntryArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.UnitID);
        invoiceEntryArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
      //Do after Close the Modal
    });
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
    //   .get("ProductID")
    //   .setValue(dataItem.ProductID);
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
