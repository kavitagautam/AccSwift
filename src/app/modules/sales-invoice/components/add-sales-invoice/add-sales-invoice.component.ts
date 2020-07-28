import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormArray, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ProductModalPopupComponent } from "@accSwift-modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { PreferenceService } from "../../../preference/services/preference.service";
import { AddProductComponent } from "@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component";
import { IconConst } from "@app/shared/constants/icon.constant";
import { CashPartyModalPopupComponent } from "@accSwift-modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { CashParty } from "@accSwift-modules/accswift-shared/models/cash-party.model";
import { RelatedUnits } from "@accSwift-modules/accswift-shared/models/related-unit.model";
import { ProductMin } from "@accSwift-modules/product/models/product-min.model";

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
  relatedUnits: RelatedUnits[] = [];
  cashPartyList: CashParty[] = [];
  public productList: ProductMin[] = [];
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
  @ViewChild("anchor") public anchor: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public salesInvoiceService: SalesInvoiceService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService,
    private preferenceService: PreferenceService
  ) {
    this.salesInvoiceService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
    this.salesInvoiceService.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
    });
  }

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
      VAT: [0],
      Remarks: [""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()]),
    });
    this.seriesValueChange();
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductCode: ["", null, this.productCodeMatch.productCodeMatch()],
      ProductID: [""],
      ProductName: [""],
      CodeName: [""],
      Quantity: ["", Validators.required],
      QtyUnitID: ["", Validators.required],
      QtyUnitName: [""],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [""],
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

  seriesValueChange(): void {
    const seriesChange = this.salesInvoiceForm.get("SeriesID").value;
    if (seriesChange) {
      this.salesInvoiceService
        .getVoucherNoWithSeriesChange(seriesChange)
        .subscribe((response) => {
          this.salesInvoiceForm.get("VoucherNo").setValue(response.VoucherNO);
          if (response.IsEnabled) {
            this.salesInvoiceForm.get("VoucherNo").enable();
          } else {
            this.salesInvoiceForm.get("VoucherNo").disable();
          }
          if (response.VoucherNoType === "Automatic") {
            this.IsAutomatic = true;
          }
        });
    }
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

  // Filterable Cash Party Drop-down
  cashPartyDDFilter(value): void {
    this.cashPartyList = this.salesInvoiceService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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
        this.salesInvoiceForm.get("CashPartyLedgerID").setValue(data.LedgerID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
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

  private showUnitPopup: boolean = true;
  rowPopupIndexUnit: number;
  unitClick = false;
  discClick = false;
  public unitPopup(number): void {
    this.unitClick = true;
    this.discClick = false;
    this.rowPopupIndexUnit = number;
    this.showUnitPopup = !this.showUnitPopup;
  }

  private showDiscPopup: boolean = true;
  rowPopupIndexDisc: number;

  public discPopup(number): void {
    this.unitClick = false;
    this.discClick = true;
    this.rowPopupIndexDisc = number;
    this.showDiscPopup = !this.showDiscPopup;
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      // //
      // if (this.unitClick) {
      //   this.showUnitPopup = !this.showUnitPopup;
      // }
      // if (this.taxClick) {
      //   this.showTaxPopup = !this.showTaxPopup;
      // }
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  //Change Discount Value
  changeDiscountValue(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
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

  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
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
      this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);
      this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
      this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
      this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
      this.salesInvoiceForm.get("VAT").setValue(this.vatTotalAmount);
    });
  }

  //tax Change value calculation
  handleTaxChange(value, index): void {
    const selectedTaxValue = this.salesInvoiceService.taxList.filter(
      (s) => s.ID === value
    );
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
    );
    let netAmountV = invoiceEntryArray.controls[index].get("NetAmount").value;
    if (selectedTaxValue) {
      invoiceEntryArray.controls[index]
        .get("TaxAmount")
        .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
    }
    this.myFormValueChanges$.subscribe((changes) =>
      this.invoiceValueChange(changes)
    );
  }

  productDDFilter(value, i): void {
    this.productList = this.salesInvoiceService.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.salesInvoiceService.productList.filter(
      (s) => s.ProductID === value
    );
  }

  handleProductChange(value, index): void {
    const selectedProductValue = this.salesInvoiceService.productList.filter(
      (s) => s.ProductID === value
    );
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
    );
    if (selectedProductValue && selectedProductValue.length > 0) {
      invoiceEntryArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      invoiceEntryArray.controls[index]
        .get("ProductID")
        .setValue(selectedProductValue[0].ProductID);
      invoiceEntryArray.controls[index]
        .get("CodeName")
        .setValue(selectedProductValue[0].CodeName);
      invoiceEntryArray.controls[index]
        .get("ProductName")
        .setValue(selectedProductValue[0].ProductName);
      invoiceEntryArray.controls[index].get("Quantity").setValue(1);
      invoiceEntryArray.controls[index]
        .get("QtyUnitID")
        .setValue(selectedProductValue[0].QtyUnitID);
      invoiceEntryArray.controls[index]
        .get("QtyUnitName")
        .setValue(selectedProductValue[0].QtyUnitName);
      invoiceEntryArray.controls[index]
        .get("SalesRate")
        .setValue(selectedProductValue[0].SalesRate);

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
      const invoiceEntry = <FormArray>(
        this.salesInvoiceForm.get("InvoiceDetails")
      );
      if (invoiceEntry.invalid) return;
      (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
        this.addInvoiceEntryList()
      );
    }
  }

  handelProductCode(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
    );

    this.myFormValueChanges$.subscribe((changes) =>
      this.invoiceValueChange(changes)
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
            .get("SalesRate")
            .setValue(selectedItem[0].SalesRate);

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

        (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
          this.addInvoiceEntryList()
        );
      });
    }
  }

  addNewProduct(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(AddProductComponent, this.config);
    this.modalRef.content.action = "Select";
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
        const invoiceEntryArray = <FormArray>(
          this.salesInvoiceForm.get("InvoiceDetails")
        );
        invoiceEntryArray.controls[index]
          .get("ProductCode")
          .setValue(data.ProductCode);
        invoiceEntryArray.controls[index]
          .get("CodeName")
          .setValue(data.CodeName);
        invoiceEntryArray.controls[index]
          .get("ProductID")
          .setValue(data.ProductID);
        invoiceEntryArray.controls[index]
          .get("ProductName")
          .setValue(data.ProductName);
        invoiceEntryArray.controls[index].get("Quantity").setValue(1);
        invoiceEntryArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.QtyUnitID);
        invoiceEntryArray.controls[index]
          .get("QtyUnitName")
          .setValue(data.QtyUnitName);
        invoiceEntryArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
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

        this.grandTotalAmount =
          this.totalGrossAmount -
          this.totalDiscountAmount +
          this.vatTotalAmount +
          this.totalTaxAmount;
        this.getRelatedUnitList(data.ProductID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  getRelatedUnitList(productCode): void {
    this.salesInvoiceService
      .getRelatedUnits(productCode)
      .subscribe((response) => {
        this.relatedUnits = response.Entity;
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
    const invoiceEntry = <FormArray>this.salesInvoiceForm.get("InvoiceDetails");
    if (invoiceEntry.invalid) return;
    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.salesInvoiceForm.get("InvoiceDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
