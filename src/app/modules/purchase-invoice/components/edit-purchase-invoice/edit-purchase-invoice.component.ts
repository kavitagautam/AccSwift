import { PurchaseInvoice } from "./../../models/purchase-invoice.model";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { takeUntil, debounceTime } from "rxjs/operators";
import { RelatedUnits } from "@accSwift-modules/accswift-shared/models/related-unit.model";

@Component({
  selector: "accSwift-edit-purchase-invoice",
  templateUrl: "../common-html/purchase-invoice.html",
})
export class EditPurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm: FormGroup;
  numericFormat: string = "n2";
  public decimals: number = 2;
  purchaseDetails: PurchaseInvoice;
  relatedUnits: RelatedUnits[];
  //Total Calculation
  myFormValueChanges$;

  private destroyed$ = new Subject<void>();
  submitted: boolean;

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
  rowSubmitted: boolean;
  editedRowIndex: any;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseService: PurchaseInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
    this.purchaseInvoiceForm.valueChanges.subscribe((changes) => {
      this.invoiceValueChange(changes);
    });
  }

  buildEditInvoiceForm(): void {
    this.purchaseInvoiceForm = this._fb.group({
      ID: [this.purchaseDetails ? this.purchaseDetails.ID : null],
      SeriesID: [this.purchaseDetails ? this.purchaseDetails.SeriesID : 279],
      CashPartyLedgerID: this.purchaseDetails
        ? [this.purchaseDetails.CashPartyLedgerID, [Validators.required]]
        : null,
      PurchaseLedgerID: [
        this.purchaseDetails ? this.purchaseDetails.PurchaseLedgerID : null,
      ],
      VoucherNo: [
        this.purchaseDetails ? this.purchaseDetails.VoucherNo : "",
        [Validators.required],
      ],
      PartyBillNumber: [
        this.purchaseDetails ? this.purchaseDetails.PartyBillNumber : "",
      ],
      DepotID: [
        this.purchaseDetails ? this.purchaseDetails.DepotID : null,
        [Validators.required],
      ],
      ProjectID: [this.purchaseDetails ? this.purchaseDetails.ProjectID : null],
      Date: [this.purchaseDetails ? new Date(this.purchaseDetails.Date) : ""],
      OrderNo: [
        this.purchaseDetails ? this.purchaseDetails.OrderNo : "",
        [Validators.required],
      ],
      TotalTCAmount: [
        this.purchaseDetails ? this.purchaseDetails.TotalTCAmount : 0,
      ],
      SpecialDiscount: [
        this.purchaseDetails ? this.purchaseDetails.SpecialDiscount : 0,
      ],
      TotalAmount: [
        this.purchaseDetails ? this.purchaseDetails.TotalAmount : 0,
      ],
      TotalQty: [this.purchaseDetails ? this.purchaseDetails.TotalQty : 0],
      GrossAmount: [
        this.purchaseDetails ? this.purchaseDetails.GrossAmount : 0,
        Validators.required,
      ],
      NetAmount: [this.purchaseDetails ? this.purchaseDetails.NetAmount : 0],
      Remarks: [this.purchaseDetails ? this.purchaseDetails.Remarks : ""],
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
      QtyUnitID: [null],
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
      TaxID: [null],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = +params.get("id");
      if (param) {
        this.purchaseService
          .getPurchaseInvoiceDetails(param)
          .subscribe((res) => {
            this.purchaseDetails = res.Entity;
            this.setInvoiceList();
            this.purchaseInvoiceForm.patchValue(this.purchaseDetails);
          });
      }
    });
  }

  setInvoiceList(): void {
    this.purchaseInvoiceForm.setControl(
      "PurchInvoiceDetails",
      this.setInvoiceDetailsFormArray(this.purchaseDetails.PurchInvoiceDetails)
    );

    (<FormArray>this.purchaseInvoiceForm.get("PurchInvoiceDetails")).push(
      this.addPurchaseInvoiceEntryList()
    );
  }

  // this block of code is used to show form array data in the template.....
  setInvoiceDetailsFormArray(invoiceDetails): FormArray {
    const invoiceFormArray = new FormArray([]);
    if (invoiceDetails && invoiceDetails.length > 0) {
      invoiceDetails.forEach((element) => {
        invoiceFormArray.push(
          this._fb.group({
            ID: [element.ID],
            ProductID: [element.ProductID],
            ProductName: [element.ProductName],
            ProductCode: [element.ProductCode],
            CodeName: [element.CodeName],
            Quantity: [element.Quantity],
            QtyUnitName: [element.QtyUnitName],
            PurchaseRate: [element.PurchaseRate],
            Amount: [element.Amount],
            DiscPercentage: [element.DiscPercentage],
            DiscountAmount: [element.DiscountAmount],
            NetAmount: [element.NetAmount],
            TaxAmount: [element.TaxAmount],
            VAT: [element.VAT],
            CustomDuty: [element.CustomDuty],
            CustomDutyPercent: [element.CustomDutyPercent],
            Freight: [element.Freight],
            QtyUnitID: [element.QtyUnitID],
            TaxID: [element.TaxID],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      invoiceFormArray.push(
        this._fb.group({
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
        })
      );
    }
    return invoiceFormArray;
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
    // if (this.purchaseInvoiceForm.invalid) return;
    this.purchaseService
      .updatePurchaseInvoice(this.purchaseInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/purchase-invoice"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice edited successfully");
        }
      );
  }

  public cancel(): void {
    this.purchaseInvoiceForm.reset();
    this.router.navigate(["/purchase-invoice"]);
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
}
