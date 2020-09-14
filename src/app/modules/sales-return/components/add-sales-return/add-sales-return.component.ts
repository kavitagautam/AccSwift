import { Router } from "@angular/router";
import { SalesReturnService } from "./../../services/sales-return.service";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";

@Component({
  selector: "accSwift-add-sales-return",
  templateUrl: "../common-html/sales-return.html",
})
export class AddSalesReturnComponent implements OnInit, OnDestroy {
  salesReturnForm: FormGroup;
  editedRowIndex: number;
  submitted: boolean;

  private destroyed$ = new Subject<void>();

  //Total Calculation
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalDiscountPercentage: number = 0;
  totalTaxAmount: number = 0;
  vatTotalAmount: number = 0;
  grandTotalAmount: number = 0;

  myFormValueChanges$;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  rowSubmitted: boolean;

  constructor(
    private _fb: FormBuilder,
    public salesReturnService: SalesReturnService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildSalesReturnForm();

    this.myFormValueChanges$ = this.salesReturnForm.controls[
      "ReturnDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe((changes) =>
      this.returnValueChange(changes)
    );
  }

  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }

  buildSalesReturnForm(): void {
    this.salesReturnForm = this._fb.group({
      ID: [null],

      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_SLS_RTN.Value
          : null,
        Validators.required,
      ],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        Validators.required,
      ],
      VoucherNo: [null],
      SalesLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
        Validators.required,
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
      OrderNo: [""],
      TotalAmount: [0, Validators.required],
      TotalQty: [0, Validators.required],
      GrossAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      Remarks: [""],
      ReturnDetails: this._fb.array([this.addReturnDetails()]),
    });
  }

  addReturnDetails(): FormGroup {
    return this._fb.group({
      ID: [null],
      ProductID: [null],
      ProductName: [""],
      CodeName: [""],
      ProductCode: [""],
      Quantity: [null],
      QtyUnitID: [null],
      QtyUnitName: [""],
      SalesReturnID: [null],
      SalesRate: [null],
      VATAmount: [null],
      DiscPercentage: [0],
      DiscountAmount: [0],
      NetAmount: [null],
      TaxID: [null],
      TaxAmount: [0],
      Amount: [0],
      Remarks: [""],
    });
  }

  private returnValueChange(value): void {
    this.salesReturnForm.controls["ReturnDetails"].valueChanges
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
          if (invoices && invoices[i].TaxAmount) {
            sumTaxAmount = sumTaxAmount + invoices[i].TaxAmount;
          }
        }

        this.totalQty = sumQty;
        this.totalGrossAmount = sumGrossAmount;
        this.totalNetAmount = sumNetAmount;
        this.totalDiscountAmount = sumDiscountAmount;
        this.totalDiscountPercentage = sumTotalDiscountPer;
        this.totalTaxAmount = sumTaxAmount;

        this.vatTotalAmount = this.totalNetAmount * 0.13;
        this.grandTotalAmount =
          this.totalGrossAmount -
          this.totalDiscountAmount +
          this.vatTotalAmount +
          this.totalTaxAmount;
      });
  }

  public save(): void {
    if (this.salesReturnForm.invalid) return;

    this.salesReturnService
      .addSalesReturn(this.salesReturnForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-return"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Sales Return added successfully");
        }
      );
  }

  public cancel(): void {
    this.salesReturnForm.reset();
    this.router.navigate(["/sales-return"]);
  }
}
