import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ProductModelPopupComponent } from "@app/shared/component/product-model-popup/product-model-popup.component";

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
    public salesInvoiceService: SalesInvoiceService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildAddSalesInvoiceForm();
  }

  buildAddSalesInvoiceForm(): void {
    this.addInvoiceForm = this._fb.group({
      SeriesID: ["", Validators.required],
      CashPartyLedgerID: [null],
      VoucherNo: [null, Validators.required],
      SalesLedgerID: [null],
      DepotID: [null],
      ProjectID: [null, Validators.required],
      Date: [new Date()],
      OrderNo: [""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()])
    });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ProductCode: [""],
      ProductName: ["", Validators.required],
      ProductID: [null, Validators.required],
      Quantity: ["", Validators.required],
      QtyUnitID: [null, Validators.required],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: ["", Validators.required],
      DiscountAmount: ["", Validators.required],
      NetAmount: ["", Validators.required],
      TaxID: [null],
      TaxAmount: [""]
    });
  }

  public save(): void {
    if (this.addInvoiceForm.invalid) return;
    this.salesInvoiceService
      .addSalesInvoice(this.addInvoiceForm.value)
      .subscribe(
        response => {
          this.router.navigate(["/sales-invoice"]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice added successfully");
        }
      );
  }

  public cancel(): void {
    this.addInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.addInvoiceForm.get("InvoiceDetails");
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
          this.addInvoiceForm.get("InvoiceDetails")
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

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>this.addInvoiceForm.get("InvoiceDetails");
    console.log("From Control " + this.addInvoiceForm.value);
    if (invoiceEntry.invalid) return;
    (<FormArray>this.addInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    // const invoiceEntry = <FormArray>this.addInvoiceForm.get("InvoiceDetails");
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
    sender.editRow(rowIndex, this.addInvoiceForm.get("InvoiceDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
