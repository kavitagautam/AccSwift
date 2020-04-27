import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { SalesReturnService } from "./../../services/sales-return.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CashParty,
  RelatedUnits,
  SalesReturnDetail,
} from "../../models/sales-return.model";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@app/shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { CashPartyModalPopupComponent } from "@app/shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { ProductModalPopupComponent } from "@app/shared/components/product-modal-popup/product-modal-popup.component";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-edit-sales-return",
  templateUrl: "../common-html/sales-return.html",
  styleUrls: ["./edit-sales-return.component.scss"],
})
export class EditSalesReturnComponent implements OnInit, OnDestroy {
  salesReturnForm: FormGroup;
  salesReturnDetails: SalesReturnDetail;
  editedRowIndex: any;
  cashPartyList: CashParty[] = [];
  relatedUnits: RelatedUnits[] = [];

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
  ) {
    this.salesReturnService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
  }

  ngOnInit(): void {
    this.buildSalesReturnForm(); //Initialize the form
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
    this.myFormValueChanges$ = this.salesReturnForm.controls[
      "ReturnDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe((changes) =>
      this.returnValueChange(changes)
    );
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
            this.buildSalesReturnForm();
            this.setReturnList();
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
      ProductCode: [""],
      ProductName: [""],
      ProductID: [null],
      Quantity: [1],
      QtyUnitID: [null],
      SalesRate: [""],
      Amount: [""],
      DiscPercentage: [""],
      DiscountAmount: [""],
      NetAmount: [""],
      TaxID: [null],
      TaxAmount: [""],
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
            ProductCode: [
              element.ProductCode,
              null,
              this.productCodeMatch.productCodeMatch(),
            ],
            ProductName: [element.ProductName],
            ProductID: [element.ProductID],
            Quantity: [element.Quantity],
            QtyUnitID: [element.QtyUnitID],
            SalesRate: [element.SalesRate],
            Amount: [element.Amount],
            DiscPercentage: [element.DiscPercentage],
            DiscountAmount: [element.DiscountAmount],
            NetAmount: [element.NetAmount],
            TaxID: [element.TaxID],
            TaxAmount: [element.TaxAmount],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      returnDetailsArray.push(
        this._fb.group({
          ID: [0],
          ProductCode: ["", null, this.productCodeMatch.productCodeMatch()],
          ProductName: [""],
          ProductID: [null],
          Quantity: [1],
          QtyUnitID: [null],
          SalesRate: [""],
          Amount: [""],
          DiscPercentage: [0],
          DiscountAmount: [0],
          NetAmount: [0],
          TaxID: [null],
          TaxAmount: [""],
          Remarks: [""],
        })
      );
    }
    return returnDetailsArray;
  }

  get getReturnDetailList() {
    return this.salesReturnForm.get("ReturnDetails");
  }

  getRelatedUnits(productCode): void {
    this.salesReturnService
      .getRelatedUnits(productCode)
      .subscribe((response) => {
        this.relatedUnits = response.Entity;
      });
  }

  // Filterable Cash Party Drop-down
  cashPartyDDFilter(value): void {
    this.cashPartyList = this.salesReturnService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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

  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const returnArray = <FormArray>this.salesReturnForm.get("ReturnDetails");

    this.myFormValueChanges$.subscribe((changes) =>
      this.returnValueChange(changes)
    );
    let qunatityValue = returnArray.controls[index].get("Quantity").value;

    let salesRateValue = returnArray.controls[index].get("SalesRate").value;
    let discountPer = returnArray.controls[index].get("DiscPercentage").value;
    let discountAmountValue = returnArray.controls[index].get("DiscountAmount")
      .value;
    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = discountPer * amountC;

    returnArray.controls[index].get("Amount").setValue(amountC);

    // discount Amount Input
    if (discountAmountValue) {
      let calculatePercentage = discountAmountValue / amountC;
      returnArray.controls[index]
        .get("DiscPercentage")
        .setValue(calculatePercentage);
      discountPer = calculatePercentage;
      discountAmountC = amountC * discountPer;
    }
    returnArray.controls[index].get("DiscountAmount").setValue(discountAmountC);
    returnArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);

    this.vatTotalAmount = discountAmountC * 0.13;
    this.grandTotalAmount =
      this.totalGrossAmount -
      this.totalDiscountAmount +
      this.vatTotalAmount +
      this.totalTaxAmount;
  }

  //tax Change value calculation
  handleTaxChange(value, index): void {
    const selectedTaxValue = this.salesReturnService.taxList.filter(
      (s) => s.ID === value
    );
    const returnArray = <FormArray>this.salesReturnForm.get("ReturnDetails");
    let netAmountV = returnArray.controls[index].get("NetAmount").value;
    returnArray.controls[index]
      .get("TaxAmount")
      .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const returnArray = <FormArray>(
          this.salesReturnForm.get("ReturnDetails")
        );
        returnArray.controls[index].get("ProductCode").setValue(data.Code);
        returnArray.controls[index].get("ProductID").setValue(data.ID);
        returnArray.controls[index].get("ProductName").setValue(data.Name);
        returnArray.controls[index].get("Quantity").setValue(1);
        returnArray.controls[index].get("QtyUnitID").setValue(data.UnitID);
        returnArray.controls[index].get("SalesRate").setValue(data.SalesRate);
        returnArray.controls[index]
          .get("Amount")
          .setValue(
            data.SalesRate * returnArray.controls[index].get("Quantity").value
          );
        returnArray.controls[index].get("DiscPercentage").setValue(0);
        returnArray.controls[index]
          .get("DiscountAmount")
          .setValue(
            returnArray.controls[index].get("DiscPercentage").value *
              returnArray.controls[index].get("Amount").value
          );
        returnArray.controls[index]
          .get("NetAmount")
          .setValue(
            returnArray.controls[index].get("Amount").value -
              returnArray.controls[index].get("DiscountAmount").value
          );

        returnArray.controls[index].get("TaxID").setValue("");
        returnArray.controls[index].get("TaxAmount").setValue("");
        returnArray.controls[index].get("Remarks").setValue("");

        this.grandTotalAmount =
          this.totalGrossAmount -
          this.totalDiscountAmount +
          this.vatTotalAmount +
          this.totalTaxAmount;
        this.getRelatedUnits(data.ID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  openCashPartyModel(): void {
    this.modalRef = this.modalService.show(
      CashPartyModalPopupComponent,
      this.config
    );
    this.modalRef.content.action = "Select";

    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        // Do After the the sucess
        this.salesReturnForm.get("CashPartyLedgerID").setValue(data.LedgerID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    //this.formGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const salesReturnEntry = <FormArray>(
      this.salesReturnForm.get("ReturnDetails")
    );
    if (salesReturnEntry.invalid) return;
    (<FormArray>salesReturnEntry).push(this.addSalesReturnEntryList());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesReturnEntry = <FormArray>(
      this.salesReturnForm.get("ReturnDetails")
    );
    salesReturnEntry.controls[rowIndex]
      .get("ProductName")
      .setValue(dataItem.ProductName);
    salesReturnEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    salesReturnEntry.controls[rowIndex]
      .get("PurchaseRate")
      .setValue(dataItem.PurchaseRate);
    salesReturnEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    salesReturnEntry.controls[rowIndex]
      .get("NetAmount")
      .setValue(dataItem.NetAmount);
    salesReturnEntry.controls[rowIndex].get("TaxID").setValue(dataItem.TaxID);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.salesReturnForm.get("ReturnDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.salesReturnForm.get("ReturnDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
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
