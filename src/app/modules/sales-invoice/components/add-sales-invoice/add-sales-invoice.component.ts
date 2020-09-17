import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormArray, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { PreferenceService } from "../../../preference/services/preference.service";
import { IconConst } from "@app/shared/constants/icon.constant";

@Component({
  selector: "accSwift-add-sales-invoice",
  templateUrl: "../common-html/common-sales-invoice.html",
  styleUrls: ["../common-html/sales-invoice.component.scss"],
})
export class AddSalesInvoiceComponent implements OnInit, OnDestroy {
  salesInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean = false;
  private editedRowIndex: number;
  //Total Calculation
  myFormValueChanges$;
  private destroyed$ = new Subject<void>();
  iconConst = IconConst;
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalDiscountPercentage: number = 0;
  totalTaxAmount: number = 0;
  tenderAmount: number = 0;
  changeAmount: number = 0;
  adjustmentAmount: number = 0;
  vatTotalAmount: number = 0;
  grandTotalAmount: number = 0;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public salesInvoiceService: SalesInvoiceService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildAddSalesInvoiceForm();
    this.myFormValueChanges$ = this.salesInvoiceForm.controls[
      "InvoiceDetails"
    ].valueChanges;
    this.myFormValueChanges$.subscribe((changes) => {
      this.invoiceValueChange(changes);
    });
  }

  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildAddSalesInvoiceForm(): void {
    this.salesInvoiceForm = this._fb.group({
      ID: [null],
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_SALES.Value
          : null,
        Validators.required,
      ],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
      ],
      VoucherNo: [null, Validators.required],
      SalesLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      DepotID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
        Validators.required,
      ],
      Date: [new Date()],
      IsPay: [false],
      OrderNo: [""],
      TotalAmount: [0, Validators.required],
      TotalQty: [0, Validators.required],
      GrossAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      SpecialDiscount: [0, Validators.required],
      VAT: [0],
      Remarks: [""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()]),
    });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductCode: ["", null, this.productCodeMatch.productCodeMatch()],
      ProductID: [""],
      ProductName: [""],
      CodeName: [""],
      Quantity: [0, Validators.required],
      QtyUnitID: [null, Validators.required],
      QtyUnitName: [""],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [null],
      TaxAmount: [""],
      Remarks: [""],
    });
  }

  tenderForm: FormGroup;
  buildTenderForm(): void {
    this.tenderForm = this._fb.group({
      tenderAmount: [{ value: this.grandTotalAmount, disabled: true }],
      adjustAmount: [""],
      payableAmount: [
        {
          value: "",

          disabled: true,
        },
      ],
      paidAmount: [""],
      returnAmount: [
        {
          value: "",

          disabled: true,
        },
      ],
    });
    this.tenderForm.get("adjustAmount").valueChanges.subscribe((value) => {
      const payableA =
        this.tenderForm.get("tenderAmount").value -
        this.tenderForm.get("adjustAmount").value;
      this.tenderForm.get("payableAmount").setValue(payableA.toFixed(2));
    });
    this.tenderForm.get("paidAmount").valueChanges.subscribe((value) => {
      const paidA =
        this.tenderForm.get("paidAmount").value -
        this.tenderForm.get("tenderAmount").value;
      this.tenderForm.get("returnAmount").setValue(paidA.toFixed(2));
    });
  }

  invoiceBilling(): void {
    this.router.navigate(
      [
        `/sales-invoice/edit/${
          this.salesInvoiceForm.get("ID").value
        }/invoice-billing`,
      ],
      { state: this.salesInvoiceForm.value }
    );
    localStorage.setItem(
      "invoices",
      JSON.stringify(this.salesInvoiceForm.value)
    );
  }

  exportToCSV() {
    const data = this.salesInvoiceForm.get("InvoiceDetails").value;
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    const csvArray = csv.join("\r\n");

    const a = document.createElement("a");
    const blob = new Blob([csvArray], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  payInvoice(): void {
    this.salesInvoiceForm.get("IsPay").setValue(true);
    this.salesInvoiceService
      .addSalesInvoice(this.salesInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-invoice"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice edited and Cash Receipt successfully");
          this.modalRef.hide();
        }
      );
  }

  public save(): void {
    this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);

    this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
    this.salesInvoiceForm
      .get("SpecialDiscount")
      .setValue(this.totalDiscountAmount);
    this.salesInvoiceForm.get("VAT").setValue(this.totalTaxAmount);
    if (this.salesInvoiceForm.invalid) return;
    this.salesInvoiceService
      .addSalesInvoice(this.salesInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-invoice"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice added successfully");
        }
      );
  }

  public cancel(): void {
    this.salesInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.salesInvoiceForm.get("InvoiceDetails");
  }

  private invoiceValueChange(value): void {
    this.salesInvoiceForm.controls["InvoiceDetails"].valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(20))
      .subscribe((invoices) => {
        let sumQty = 0;
        let sumNetAmount = 0;
        let sumGrossAmount = 0;
        let sumDiscountAmount = 0;
        let sumTotalDiscountPer = 0;
        let sumTaxAmount = 0;
        for (let i = 0; i < invoices.length; i++) {
          if (invoices && invoices[i].Quantity) {
            sumQty = sumQty + invoices[i].Quantity;
          }
          if (invoices && invoices[i].Amount) {
            sumGrossAmount = sumGrossAmount + invoices[i].Amount;
          }
          if (invoices && invoices[i].NetAmount) {
            sumNetAmount = sumNetAmount + invoices[i].NetAmount;
          }
          if (invoices && invoices[i].DiscountAmount) {
            sumDiscountAmount = sumDiscountAmount + invoices[i].DiscountAmount;
          }
          if (invoices && invoices[i].DiscPercentage) {
            sumTotalDiscountPer =
              sumTotalDiscountPer + invoices[i].DiscPercentage;
          }
          if (
            invoices &&
            invoices[i].TaxAmount &&
            invoices[i].TaxID !== null &&
            invoices[i].IsVAT
          ) {
            sumTaxAmount = sumTaxAmount + invoices[i].TaxAmount;
          }
        }

        this.totalQty = sumQty;
        this.totalGrossAmount = sumGrossAmount;
        this.totalNetAmount = sumNetAmount;
        this.totalDiscountAmount = sumDiscountAmount;
        this.totalDiscountPercentage = sumTotalDiscountPer;
        this.totalTaxAmount = sumTaxAmount;

        this.vatTotalAmount = sumTaxAmount;
        this.grandTotalAmount =
          this.totalGrossAmount -
          this.totalDiscountAmount +
          this.vatTotalAmount +
          this.totalTaxAmount;
      });
  }

  openTender(template: TemplateRef<any>): void {
    this.buildTenderForm();
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-sm",
    };
    this.modalRef = this.modalService.show(template, config);
  }
}
