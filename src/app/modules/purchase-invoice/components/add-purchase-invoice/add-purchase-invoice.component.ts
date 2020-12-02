import { Router } from "@angular/router";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";

@Component({
  selector: "accSwift-add-purchase-invoice",
  templateUrl: "../common-html/purchase-invoice.html",
})
export class AddPurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;

  //Total Calculation
  myFormValueChanges$;

  private destroyed$ = new Subject<void>();
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
  private editedRowIndex: number;
  constructor(
    private _fb: FormBuilder,
    public purchaseService: PurchaseInvoiceService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildPurchaseInvoiceForm();
    this.myFormValueChanges$ = this.purchaseInvoiceForm.controls[
      "PurchInvoiceDetails"
    ].valueChanges;
    this.myFormValueChanges$.subscribe((changes) => {
      this.invoiceValueChange(changes);
    });
  }

  buildPurchaseInvoiceForm(): void {
    this.purchaseInvoiceForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_PURCH.Value
          : null,
        Validators.required,
      ],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        Validators.required,
      ],
      PurchaseLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PURCHASE_ACCOUNT.Value
          : null,
        Validators.required,
      ],
      VoucherNo: ["", [Validators.required]],
      PartyBillNumber: [""],
      DepotID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
          : null,
        Validators.required,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
        Validators.required,
      ],
      Date: [new Date()],
      OrderNo: ["", [Validators.required]],
      TotalTCAmount: [0],
      SpecialDiscount: [0],
      TotalAmount: [0, Validators.required],
      TotalQty: [0, Validators.required],
      GrossAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      Remarks: [""],
      PurchInvoiceDetails: this._fb.array([this.addPurchaseInvoiceEntryList()]),
    });
  }

  addPurchaseInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductID: [null],
      ProductName: [""],
      ProductCode: [""],
      CodeName: [""],
      Quantity: [0],
      QtyUnitName: [""],
      PurchaseRate: [""],
      Amount: [""],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [""],
      TaxAmount: [""],
      VAT: [0],
      CustomDuty: [""],
      CustomDutyPercent: [0],
      Freight: [""],
      QtyUnitID: [null],
      TaxID: [null],
      Remarks: [""],
    });
  }

  private invoiceValueChange(value): void {
    this.purchaseInvoiceForm.controls["PurchInvoiceDetails"].valueChanges
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

          if (invoices && invoices[i].TaxAmount && invoices[i].TaxID !== null) {
            sumTaxAmount = sumTaxAmount + invoices[i].TaxAmount;
          }
        }

        this.totalQty = sumQty;
        this.totalGrossAmount = sumGrossAmount;
        this.totalNetAmount = sumNetAmount;
        this.totalDiscountAmount = sumDiscountAmount;
        this.totalDiscountPercentage = sumTotalDiscountPer;
        this.totalTaxAmount = sumTaxAmount;

        this.grandTotalAmount =
          this.totalGrossAmount -
          this.totalDiscountAmount +
          this.vatTotalAmount +
          this.totalTaxAmount;
      });
  }

  public save(): void {
    this.purchaseInvoiceForm.get("TotalQty").setValue(this.totalQty);
    this.purchaseInvoiceForm.get("TotalTCAmount").setValue(this.totalTaxAmount);
    this.purchaseInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.purchaseInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    this.purchaseInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
    this.purchaseInvoiceForm
      .get("SpecialDiscount")
      .setValue(this.totalDiscountAmount);
    //  if (this.purchaseInvoiceForm.invalid) return;
    this.purchaseService
      .addPurchaseInvoice(this.purchaseInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/purchase-invoice"]);
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
    this.purchaseInvoiceForm.reset();
    this.router.navigate(["/purchase-invoice"]);
  }
}
