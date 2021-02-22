import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { SalesReturnService } from "./../../services/sales-return.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SalesReturn } from "../../models/sales-return.model";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";

import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-edit-sales-return",
  templateUrl: "../common-html/sales-return.html",
  styleUrls: ["../common-html/sales-return.component.scss"]
})
export class EditSalesReturnComponent implements OnInit, OnDestroy {
  salesReturnForm: FormGroup;
  salesReturnDetails: SalesReturn;
  editedRowIndex: any;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  //Total Calculation
  totalQty: number = 0;
  myFormValueChanges$;
  private destroyed$ = new Subject<void>();

  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalDiscountPercentage: number = 0;
  totalTaxAmount: number = 0;
  vatTotalAmount: number = 0;
  grandTotalAmount: number = 0;
  tenderAmount: number = 0;
  changeAmount: number = 0;
  adjustmentAmount: number = 0;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(
    private _fb: FormBuilder,
    public salesReturnService: SalesReturnService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService
  ) {}

  ngOnInit(): void {
    this.buildSalesReturnForm(); //Initialize the form
    this.myFormValueChanges$ = this.salesReturnForm.controls[
      "ReturnDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe((changes) =>
      this.returnValueChange(changes)
    );
    this.getIdFromRoute();
  }

  buildSalesReturnForm(): void {
    this.salesReturnForm = this._fb.group({
      ID: [this.salesReturnDetails ? this.salesReturnDetails.ID : 0],
      SeriesID: [
        this.salesReturnDetails ? this.salesReturnDetails.SeriesID : null,
        [Validators.required],
      ],
      CashPartyLedgerID: [
        this.salesReturnDetails
          ? this.salesReturnDetails.CashPartyLedgerID
          : null,
      ],
      VoucherNo: [
        this.salesReturnDetails ? this.salesReturnDetails.VoucherNo : "",
      ],
      SalesLedgerID: [
        this.salesReturnDetails ? this.salesReturnDetails.SalesLedgerID : null,
      ],
      DepotID: [
        this.salesReturnDetails ? this.salesReturnDetails.DepotID : null,
      ],
      ProjectID: [
        this.salesReturnDetails ? this.salesReturnDetails.ProjectID : null,
        [Validators.required],
      ],
      TotalAmount: [
        this.salesReturnDetails ? this.salesReturnDetails.TotalAmount : 0,
      ],
      TotalQty: [
        this.salesReturnDetails ? this.salesReturnDetails.TotalQty : 0,
      ],
      GrossAmount: [
        this.salesReturnDetails ? this.salesReturnDetails.GrossAmount : 0,
        Validators.required,
      ],
      NetAmount: [
        this.salesReturnDetails ? this.salesReturnDetails.NetAmount : 0,
      ],
      Date: [
        this.salesReturnDetails ? new Date(this.salesReturnDetails.Date) : "",
      ],
      OrderNo: [this.salesReturnDetails ? this.salesReturnDetails.OrderNo : ""],
      Remarks: [this.salesReturnDetails ? this.salesReturnDetails.Remarks : ""],
      ReturnDetails: this._fb.array([this.addSalesReturnEntryList()]),
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.salesReturnService
          .getSalesReturnDetails(param)
          .subscribe((response) => {
            this.salesReturnDetails = response.Entity;
            if (this.salesReturnDetails) {
              this.totalGrossAmount = this.salesReturnDetails.GrossAmount;
              this.totalNetAmount = this.salesReturnDetails.NetAmount;
              this.totalQty = this.salesReturnDetails.TotalQty;
              this.totalDiscountPercentage = this.salesReturnDetails.SpecialDiscount;
              this.vatTotalAmount = this.salesReturnDetails.VAT;
              this.totalDiscountAmount =
                this.salesReturnDetails.GrossAmount -
                this.salesReturnDetails.NetAmount;
              this.grandTotalAmount = this.salesReturnDetails.TotalAmount;
            }
            this.setReturnList();
            this.salesReturnForm.patchValue(this.salesReturnDetails);
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.myFormValueChanges$.unsubscribe();
  }

  addSalesReturnEntryList(): FormGroup {
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

  setReturnList(): void {
    this.salesReturnForm.setControl(
      "ReturnDetails",
      this.setReturnDetailsFormArray(this.salesReturnDetails.ReturnDetails)
    );

    (<FormArray>this.salesReturnForm.get("ReturnDetails")).push(
      this.addSalesReturnEntryList()
    );
  }

  // this block of code is used to show form array data in the template.....
  setReturnDetailsFormArray(returnDetails): FormArray {
    const returnDetailsArray = new FormArray([]);
    if (returnDetails && returnDetails.length > 0) {
      returnDetails.forEach((element) => {
        returnDetailsArray.push(
          this._fb.group({
            ID: [element.ID],
          ProductID: [element.ProductID],
          ProductName: [element.ProductName],
          CodeName: [element.CodeName],
          ProductCode: [element.ProductName, null, this.productCodeMatch.productCodeMatch()],
          Quantity: [element.Quantity],
          QtyUnitID: [element.QtyUnitID],
          QtyUnitName: [element.QtyUnitName],
          SalesReturnID: [element.SalesReturnID],
          SalesRate: [element.SalesRate],
          VATAmount: [element.VATAmount],
          DiscPercentage: [element.DiscPercentage],
          DiscountAmount: [element.DiscountAmount],
          NetAmount: [element.NetAmount],
          TaxID: [element.TaxID],
          TaxAmount: [element.TaxAmount],
          Amount: [element.Amount],
          Remarks: [element.Remarks],
           
          })
        );
      });
    } else {
      returnDetailsArray.push(
        this._fb.group({
          ID: [null],
          ProductID: [null],
          ProductName: [""],
          CodeName: [""],
          ProductCode: ["", null, this.productCodeMatch.productCodeMatch()],
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
        })
      );
    }
    return returnDetailsArray;
  }

  get getReturnDetailList() {
    return this.salesReturnForm.get("ReturnDetails");
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
      .updateSalesReturn(this.salesReturnForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-return"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Sales Return edited successfully");
        }
      );
  }

  public cancel(): void {
    this.salesReturnForm.reset();
    this.router.navigate(["/sales-return"]);
  }
}
