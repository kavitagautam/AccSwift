import {
  PurchaseInvoiceDetail,
  RelatedUnits,
} from "./../../models/purchase-invoice.model";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@app/shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { takeUntil, debounceTime } from "rxjs/operators";

@Component({
  selector: "accSwift-edit-purchase-invoice",
  templateUrl: "../common-html/purchase-invoice.html",
  styleUrls: ["./edit-purchase-invoice.component.scss"],
})
export class EditPurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm: FormGroup;
  numericFormat: string = "n2";
  public decimals: number = 2;
  purchaseDetails: PurchaseInvoiceDetail;
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
    private toastr: ToastrService,
    public productCodeMatch: ProductCodeValidatorsService
  ) {}

  ngOnInit(): void {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  buildEditInvoiceForm(): void {
    this.purchaseInvoiceForm = this._fb.group({
      ID: [this.purchaseDetails ? this.purchaseDetails.ID : null],
      SeriesID: [this.purchaseDetails ? this.purchaseDetails.SeriesID : null],
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
      Date: [
        this.purchaseDetails ? new Date(this.purchaseDetails.CreatedDate) : "",
      ],
      OrderNo: [
        this.purchaseDetails ? this.purchaseDetails.OrderNo : "",
        [Validators.required],
      ],
      Remarks: [this.purchaseDetails ? this.purchaseDetails.Remarks : ""],
      PurchInvoiceDetails: this._fb.array([this.addPurchaseInvoiceEntryList()]),
    });
  }

  addPurchaseInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductName: [""],
      ProductCode: [""],
      Quantity: [1],
      PurchaseRate: [""],
      Amount: [""],
      DiscPercentage: [""],
      DiscountAmount: [""],
      NetAmount: [""],
      TaxAmount: [""],
      VAT: [""],
      CustomDuty: [""],
      CustomDutyPercent: [""],
      Freight: [""],
      QtyUnitID: [null],
      TaxID: [null],
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
            this.buildEditInvoiceForm();
            this.setInvoiceList();
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
            ProductCode: [
              element.ProductCode,
              null,
              this.productCodeMatch.productCodeMatch(),
            ],
            ProductName: [element.ProductName, Validators.required],
            ProductID: [element.ProductID, Validators.required],
            Quantity: [element.Quantity, Validators.required],
            QtyUnitID: [element.QtyUnitID, Validators.required],
            PurchaseRate: [element.PurchaseRate, Validators.required],
            Amount: [element.Amount, Validators.required],
            DiscPercentage: [element.DiscPercentage, Validators.required],
            DiscountAmount: [element.DiscountAmount, Validators.required],
            NetAmount: [element.NetAmount, Validators.required],
            TaxID: [element.TaxID],
            TaxAmount: [element.TaxAmount],
            Remarks: [element.Remarks],
          })
        );
        this.getRelatedUnitList(element.ProductID);
      });
    } else {
      invoiceFormArray.push(
        this._fb.group({
          ID: [0],
          ProductCode: ["", null, this.productCodeMatch.productCodeMatch()],
          ProductName: ["", Validators.required],
          ProductID: [null, Validators.required],
          Quantity: [1, Validators.required],
          QtyUnitID: [null, Validators.required],
          PurchaseRate: ["", Validators.required],
          Amount: ["", Validators.required],
          DiscPercentage: [0, Validators.required],
          DiscountAmount: [0, Validators.required],
          NetAmount: [0, Validators.required],
          TaxID: [null],
          TaxAmount: [""],
          Remarks: [""],
        })
      );
    }
    return invoiceFormArray;
  }

  public save(): void {
    if (this.purchaseInvoiceForm.invalid) return;
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

  get getPurchaseEntryList(): FormArray {
    return <FormArray>this.purchaseInvoiceForm.get("PurchInvoiceDetails");
  }

  //Change Discount Value
  changeDiscountValue(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );
    let discountAmountValue = invoiceEntryArray.controls[index].get(
      "DiscountAmount"
    ).value;
    let qunatityValue = invoiceEntryArray.controls[index].get("Quantity").value;

    let salesRateValue = invoiceEntryArray.controls[index].get("SalesRate")
      .value;

    let amountC = qunatityValue * salesRateValue;
    let calculatePercentage = discountAmountValue / amountC;
    invoiceEntryArray.controls[index]
      .get("DiscPercentage")
      .setValue(calculatePercentage);
    let discountPer = invoiceEntryArray.controls[index].get("DiscPercentage")
      .value;
    let discountAmountC = discountPer * amountC;

    discountPer = calculatePercentage;
    discountAmountC = amountC * discountPer;
    invoiceEntryArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);

    this.myFormValueChanges$.subscribe((changes) =>
      this.invoiceValueChange(changes)
    );
  }

  changeInvoiceValues(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );

    let qunatityValue = invoiceEntryArray.controls[index].get("Quantity").value;

    let salesRateValue = invoiceEntryArray.controls[index].get("SalesRate")
      .value;
    let discountPer = invoiceEntryArray.controls[index].get("DiscPercentage")
      .value;
    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = discountPer * amountC;

    invoiceEntryArray.controls[index]
      .get("DiscountAmount")
      .setValue(discountAmountC);
    invoiceEntryArray.controls[index].get("Amount").setValue(amountC);
    invoiceEntryArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);

    this.myFormValueChanges$.subscribe((changes) => {
      this.invoiceValueChange(changes);
    });
  }

  handleTaxChange(value, index): void {
    const selectedTaxValue = this.purchaseService.taxList.filter(
      (s) => s.ID === value
    );
    const invoiceEntryArray = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );
    let netAmountV = invoiceEntryArray.controls[index].get("NetAmount").value;
    invoiceEntryArray.controls[index]
      .get("TaxAmount")
      .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
  }

  handelProductCode(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );

    const productCode = invoiceEntryArray.controls[index].get("ProductCode")
      .value;
    if (
      invoiceEntryArray.controls[index].get("ProductCode").status === "VALID"
    ) {
      this.productCodeMatch.checkProductCode(productCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          invoiceEntryArray.controls[index]
            .get("ProductCode")
            .setValue(selectedItem[0].Code);
          invoiceEntryArray.controls[index]
            .get("ProductID")
            .setValue(selectedItem[0].ID);
          invoiceEntryArray.controls[index]
            .get("ProductName")
            .setValue(selectedItem[0].Name);
          invoiceEntryArray.controls[index].get("Quantity").setValue(1);
          invoiceEntryArray.controls[index]
            .get("QtyUnitID")
            .setValue(selectedItem[0].UnitID);
          invoiceEntryArray.controls[index]
            .get("PurchaseRate")
            .setValue(selectedItem[0].PurchaseRate);

          invoiceEntryArray.controls[index]
            .get("Amount")
            .setValue(
              invoiceEntryArray.controls[index].get("SalesRate").value *
                invoiceEntryArray.controls[index].get("Quantity").value
            );
          invoiceEntryArray.controls[index].get("DiscPercentage").setValue(0);
          invoiceEntryArray.controls[index]
            .get("DiscountAmount")
            .setValue(
              invoiceEntryArray.controls[index].get("DiscPercentage").value *
                invoiceEntryArray.controls[index].get("Amount").value
            );
          invoiceEntryArray.controls[index]
            .get("NetAmount")
            .setValue(
              invoiceEntryArray.controls[index].get("Amount").value -
                invoiceEntryArray.controls[index].get("DiscountAmount").value
            );

          invoiceEntryArray.controls[index].get("TaxID").setValue("");
          invoiceEntryArray.controls[index].get("TaxAmount").setValue("");
          invoiceEntryArray.controls[index].get("Remarks").setValue("");
        }

        (<FormArray>this.purchaseInvoiceForm.get("PurchInvoiceDetails")).push(
          this.addPurchaseInvoiceEntryList()
        );
      });
    }
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

  getRelatedUnitList(id): void {
    this.purchaseService.getRelatedUnits(id).subscribe((response) => {
      this.relatedUnits = response.Entity;
    });
  }

  private closeEditor(grid, rowIndex = 1): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }): void {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseInvoiceEntry = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );
    if (purchaseInvoiceEntry.invalid) return;
    (<FormArray>this.purchaseInvoiceForm.get("PurchInvoiceDetails")).push(
      this.addPurchaseInvoiceEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }): void {
    this.closeEditor(sender);
    const purchaseInvoiceEntry = <FormArray>(
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );
    purchaseInvoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("productName")
      .setValue(dataItem.productName);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("quantity")
      .setValue(dataItem.quantity);
    purchaseInvoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("purchaseRate")
      .setValue(dataItem.purchaseRate);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("amount")
      .setValue(dataItem.amount);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("specialDiscount")
      .setValue(dataItem.specialDiscount);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    purchaseInvoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("customDuty")
      .setValue(dataItem.customDuty);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("freight")
      .setValue(dataItem.freight);
    purchaseInvoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("tcAmount")
      .setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.purchaseInvoiceForm.get("PurchInvoiceDetails")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.purchaseInvoiceForm.get("PurchInvoiceDetails")).removeAt(
      rowIndex
    );
  }

  public cancelHandler({ sender, rowIndex }): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
