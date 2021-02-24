import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
  LOCALE_ID,
  Inject,
} from "@angular/core";
import {
  FormArray,
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { DetailsEntryGridService } from "../../services/details-entry-grid/details-entry-grid.service";
import { AddProductComponent } from "../add-product/add-product/add-product.component";
import { BsModalRef, BsModalService, BsLocaleService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { RelatedUnits } from "../../models/related-unit.model";
import { CashParty } from "../../models/cash-party.model";
import { ProductMin } from "@accSwift-modules/product/models/product-min.model";
import { ProductModalPopupComponent } from "../product-modal-popup/product-modal-popup.component";
import { LedgerModalPopupComponent } from "../ledger-modal-popup/ledger-modal-popup.component";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { IntlService, CldrIntlService } from "@progress/kendo-angular-intl";
import { LedgerMin } from "@accSwift-modules/ledger/models/ledger.models";
import { EntrySubLedgerComponent } from "../entry-sub-ledger/entry-sub-ledger.component";

@Component({
  selector: "accSwift-details-entry-grid",
  templateUrl: "./details-entry-grid.component.html",
  //templateUrl: "./basic-details-entry-grid.html",
  styleUrls: ["./details-entry-grid.component.scss"],
  providers: [SettingsService],
})
export class DetailsEntryGridComponent implements OnInit {
  userType: string = localStorage.getItem("user_type");
  relatedUnits: RelatedUnits[] = [];
  cashPartyList: CashParty[] = [];
  @ViewChild("anchor") public anchor: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup: ElementRef;
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;
  public productList: ProductMin[] = [];
  public ledgerList: LedgerMin[] = [];
  @Input("entryArray")
  public entryArray: FormArray;
  @Input("voucherType") public voucherType: string;

  public defaultItem: { Name: string; Rate: number; ID: number } = {
    Name: "Select Tax...",
    Rate: null,
    ID: null,
  };

  modalRef: BsModalRef;

  private showDiscPopup: boolean = false;
  rowPopupIndexDisc: number;

  columnField = [];
  private showUnitPopup: boolean = false;
  rowPopupIndexUnit: number;
  columns = [];
  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean = false;
  private editedRowIndex: number;
  currencyFormat: string =
    "c" + JSON.parse(localStorage.getItem("decimalPlaces"));

  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    public gridServices: DetailsEntryGridService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private _fb: FormBuilder,
    @Inject(LOCALE_ID) public localeId: string,
    public intlService: IntlService
  ) {}

  ngOnInit(): void {
    this.localeId = localStorage.getItem("currencyLocaleID");
    (<CldrIntlService>this.intlService).localeId = this.localeId;
    this.gridServices.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
    });
    this.gridServices.getLedgerDD().subscribe((response) => {
      this.ledgerList = response.Entity;
    });
    for (const key in this.entryArray.value[0]) {
      this.columns.push(key);
    }
  }

  // @HostListener("keydown", ["$event"])
  // public keydown(event: any): void {
  //   if (event.keyCode === 27) {
  //     // this.toggle(false);
  //   }
  // }

  // @HostListener("document:click", ["$event"])
  // public documentClick(event: any): void {
  //   if (!this.contains(event.target)) {
  //     //  this.discountToggle(null);
  //     //this.unitPopup(null);
  //   }

  // }

  get getSubLedgerList(): FormArray {
    return <FormArray>this.entryArray.get("TransactionSubLedger");
  }

  public enabled: boolean = true;
  public duration: number = 200;
  public type: string = "slide";
  public direction: string = "down";

  public get animate(): any {
    if (this.enabled) {
      return {
        type: this.type,
        direction: this.direction,
        duration: this.duration,
      };
    }

    return false;
  }

  public get hasDirection(): boolean {
    return this.type === "slide" || this.type === "expand";
  }

  public discountToggle(rowIndex) {
    this.showDiscPopup = !this.showDiscPopup;
    this.rowPopupIndexDisc = rowIndex;
  }

  public unitToggle(rowIndex): void {
    this.showUnitPopup = !this.showUnitPopup;
    this.rowPopupIndexUnit = rowIndex;
    if (rowIndex !== null) {
      this.getRelatedUnitList(this.entryArray.value[rowIndex].ProductID);
    }
  }

  private contains(target: any): boolean {
    if (!this.anchor) return;
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  productChange(dataItem, rowIndex): Array<any> {
    this.getRelatedUnitList(dataItem.ProductID);
    return this.relatedUnits;
  }

  calculateQtyTotal(): number {
    const entryListArray = this.entryArray.value;
    let sumQty = 0;
    for (let i = 0; i < entryListArray.length; i++) {
      if (entryListArray && entryListArray[i].Quantity) {
        sumQty = sumQty + entryListArray[i].Quantity;
      }
    }
    return sumQty;
  }

  public calculateNetTotal(): number {
    const entryListArray = this.entryArray.value;
    let sumNet = 0;
    for (let i = 0; i < entryListArray.length; i++) {
      if (entryListArray && entryListArray[i].NetAmount) {
        sumNet = sumNet + entryListArray[i].NetAmount;
      }
    }
    return sumNet;
  }

  public calculateGrossTotal(): number {
    const entryListArray = this.entryArray.value;
    let sumGrossAmount = 0;
    for (let i = 0; i < entryListArray.length; i++) {
      if (entryListArray && entryListArray[i].Amount) {
        sumGrossAmount = sumGrossAmount + entryListArray[i].Amount;
      }
    }
    return sumGrossAmount;
  }

  public calculateDebitTotal(): number {
    const entryListArray = this.entryArray.value;
    let debitTotalAmount = 0;
    for (let i = 0; i < entryListArray.length; i++) {
      if (entryListArray[i].DrAmount) {
        debitTotalAmount = debitTotalAmount + entryListArray[i].DrAmount;
      }
    }
    this.debitTotal = debitTotalAmount;
    return debitTotalAmount;
  }

  public calculateCreditTotal(): number {
    const entryListArray = this.entryArray.value;
    let creditTotalAmount = 0;

    for (let i = 0; i < entryListArray.length; i++) {
      if (entryListArray[i].CrAmount) {
        creditTotalAmount = creditTotalAmount + entryListArray[i].CrAmount;
      }
    }
    this.creditTotal = creditTotalAmount;

    return creditTotalAmount;
  }

  checkDebitValue(event: Event, index: number): void {
    let debitValue = 0;
    const entryListArray = this.entryArray as FormArray;
    const updatedValue = entryListArray.controls[index].get("DrAmount").value;
    if (parseFloat(updatedValue)) {
      entryListArray.controls[index].get("CrAmount").setValue(null);
    }
    for (let j = 0; j < entryListArray.controls.length; j++) {
      debitValue =
        debitValue +
        (parseFloat(entryListArray.controls[j].get("DrAmount").value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, index: number): void {
    let creditValue = 0;
    const entryListArray = this.entryArray as FormArray;

    const updatedValue = entryListArray.controls[index].get("CrAmount").value;
    if (parseFloat(updatedValue)) {
      entryListArray.controls[index].get("DrAmount").setValue(null);
    }
    for (let j = 0; j < entryListArray.controls.length; j++) {
      creditValue =
        creditValue +
        (parseFloat(entryListArray.controls[j].get("CrAmount").value) || 0);
    }
    this.creditTotal = creditValue;
  }

  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const entryListArray = this.entryArray as FormArray;
    let qunatityValue = entryListArray.controls[index].get("Quantity").value;
    let salesPurchaseRate = 0;
    if (this.voucherType == "SALES") {
      salesPurchaseRate = entryListArray.controls[index].get("SalesRate").value;
    }
    if (this.voucherType == "PURCH") {
      salesPurchaseRate = entryListArray.controls[index].get("PurchaseRate")
        .value;
    }
    if (this.voucherType == "SLS_RTN") {
      salesPurchaseRate = entryListArray.controls[index].get("SalesRate")
        .value;
    }
    if (this.voucherType == "SLS_ORDER") {
      salesPurchaseRate = entryListArray.controls[index].get("SalesRate")
        .value;
        entryListArray.controls[index]
        .get("Amount")
        .setValue(
          entryListArray.controls[index].get("SalesRate").value *
            entryListArray.controls[index].get("Quantity").value
        );
    }

    let discountAmountC = entryListArray.controls[index].get("DiscountAmount")
      .value;

    let amountC = qunatityValue * salesPurchaseRate;
    let discountPerC = (discountAmountC / amountC) * 100;

    entryListArray.controls[index].get("DiscPercentage").setValue(discountPerC);
    entryListArray.controls[index].get("Amount").setValue(amountC);
    entryListArray.controls[index]
      .get("NetAmount")
      .setValue(
        amountC - entryListArray.controls[index].get("DiscountAmount").value
      );
    const selectedTaxValue = this.gridServices.taxList.filter(
      (s) => s.ID === entryListArray.controls[index].get("TaxID").value
    );
    if (selectedTaxValue.length > 0) {
      entryListArray.controls[index]
        .get("TaxAmount")
        .setValue(
          entryListArray.controls[index].get("Quantity").value *
            entryListArray.controls[index].get("SalesRate").value *
            (selectedTaxValue[0].Rate / 100)
        );
    }
  }
  //Change Discount Per
  discountPerCalc(dataItem, index): void {
    const entryListArray = this.entryArray as FormArray;
    let qunatityValue = entryListArray.controls[index].get("Quantity").value;
    let discountPer = entryListArray.controls[index].get("DiscPercentage")
      .value;
    let salesPurchaseRate = 0;
    if (this.voucherType == "SALES") {
      salesPurchaseRate = entryListArray.controls[index].get("SalesRate").value;
    }
    if (this.voucherType == "PURCH") {
      salesPurchaseRate = entryListArray.controls[index].get("PurchaseRate")
        .value;
    }
    let amountC = salesPurchaseRate * qunatityValue;

    entryListArray.controls[index]
      .get("DiscountAmount")
      .setValue(amountC * (discountPer / 100));

    entryListArray.controls[index]
      .get("NetAmount")
      .setValue(
        amountC - entryListArray.controls[index].get("DiscountAmount").value
      );
  }

  //Change Discount Value
  discountAmountCalc(dataItem, index): void {
    const entryListArray = this.entryArray as FormArray;
    let qunatityValue = entryListArray.controls[index].get("Quantity").value;
    let salesPurchaseRate = 0;
    if (this.voucherType == "SALES") {
      salesPurchaseRate = entryListArray.controls[index].get("SalesRate").value;
    }
    if (this.voucherType == "PURCH") {
      salesPurchaseRate = entryListArray.controls[index].get("PurchaseRate")
        .value;
    }

    let amountC = qunatityValue * salesPurchaseRate;

    let discountAmountValue = entryListArray.controls[index].get(
      "DiscountAmount"
    ).value;
    let calculatePercentage = 0;
    if (discountAmountValue) {
      calculatePercentage = discountAmountValue / amountC;
    }

    entryListArray.controls[index]
      .get("DiscPercentage")
      .setValue(calculatePercentage * 100);

    let discountAmountC = calculatePercentage * amountC;

    discountAmountC = amountC * calculatePercentage;

    entryListArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);
  }

  //tax Change value calculation
  handleTaxChange(value, index): void {
    const selectedTaxValue = this.gridServices.taxList.filter(
      (s) => s.ID === value
    );
    const entryListArray = this.entryArray as FormArray;
    let netAmountV = entryListArray.controls[index].get("NetAmount").value;
    if (selectedTaxValue.length > 0) {
      entryListArray.controls[index]
        .get("TaxAmount")
        .setValue(netAmountV * (selectedTaxValue[0].Rate / 100));
    } else {
      entryListArray.controls[index].get("TaxAmount").setValue(0);
    }
  }

  handleProductChange(value, index): void {
    const selectedProductValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );

    const entryListArray = <FormArray>this.entryArray;
    if (selectedProductValue && selectedProductValue.length > 0) {
      entryListArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      entryListArray.controls[index]
        .get("ProductID")
        .setValue(selectedProductValue[0].ProductID);

      entryListArray.controls[index]
        .get("ProductName")
        .setValue(selectedProductValue[0].ProductName);
      entryListArray.controls[index].get("Quantity").setValue(1);

      if (this.voucherType == "SALES" || this.voucherType == "SLS_RTN") {
        entryListArray.controls[index]
          .get("SalesRate")
          .setValue(selectedProductValue[0].SalesRate);

        entryListArray.controls[index]
          .get("Amount")
          .setValue(
            entryListArray.controls[index].get("SalesRate").value *
              entryListArray.controls[index].get("Quantity").value
          );
        entryListArray.controls[index]
          .get("CodeName")
          .setValue(selectedProductValue[0].CodeName);
        entryListArray.controls[index]
          .get("QtyUnitID")
          .setValue(selectedProductValue[0].QtyUnitID);
        entryListArray.controls[index]
          .get("QtyUnitName")
          .setValue(selectedProductValue[0].QtyUnitName);
        entryListArray.controls[index].get("DiscPercentage").setValue(0);
        entryListArray.controls[index]
          .get("DiscountAmount")
          .setValue(
            entryListArray.controls[index].get("DiscPercentage").value *
              entryListArray.controls[index].get("Amount").value
          );
        entryListArray.controls[index]
          .get("NetAmount")
          .setValue(
            entryListArray.controls[index].get("Amount").value -
              entryListArray.controls[index].get("DiscountAmount").value
          );

        entryListArray.controls[index]
          .get("TaxID")
          .setValue(selectedProductValue[0].TaxID);
        const selectedTaxValue = this.gridServices.taxList.filter(
          (s) => s.ID === entryListArray.controls[index].get("TaxID").value
        );

        if (selectedTaxValue.length > 0) {
          entryListArray.controls[index]
            .get("TaxAmount")
            .setValue(
              entryListArray.controls[index].get("Quantity").value *
                entryListArray.controls[index].get("SalesRate").value *
                (selectedTaxValue[0].Rate / 100)
            );
        }
        entryListArray.controls[index].get("Remarks").setValue("");
      }

      if (this.voucherType == "SLS_ORDER") {
        entryListArray.controls[index]
          .get("SalesRate")
          .setValue(selectedProductValue[0].SalesRate);
           entryListArray.controls[index]
        .get("Amount")
        .setValue(
          entryListArray.controls[index].get("SalesRate").value *
            entryListArray.controls[index].get("Quantity").value
        );
      }

      if (this.voucherType == "PURCH") {
        entryListArray.controls[index]
          .get("PurchaseRate")
          .setValue(selectedProductValue[0].PurchaseRate);

        entryListArray.controls[index]
          .get("Amount")
          .setValue(
            entryListArray.controls[index].get("PurchaseRate").value *
              entryListArray.controls[index].get("Quantity").value
          );
        entryListArray.controls[index]
          .get("CodeName")
          .setValue(selectedProductValue[0].CodeName);
        entryListArray.controls[index]
          .get("QtyUnitID")
          .setValue(selectedProductValue[0].QtyUnitID);
        entryListArray.controls[index]
          .get("QtyUnitName")
          .setValue(selectedProductValue[0].QtyUnitName);
        entryListArray.controls[index].get("DiscPercentage").setValue(0);
        entryListArray.controls[index]
          .get("DiscountAmount")
          .setValue(
            entryListArray.controls[index].get("DiscPercentage").value *
              entryListArray.controls[index].get("Amount").value
          );
        entryListArray.controls[index]
          .get("NetAmount")
          .setValue(
            entryListArray.controls[index].get("Amount").value -
              entryListArray.controls[index].get("DiscountAmount").value
          );
        entryListArray.controls[index]
          .get("TaxID")
          .setValue(selectedProductValue[0].TaxID);
        const selectedTaxValue = this.gridServices.taxList.filter(
          (s) => s.ID === entryListArray.controls[index].get("TaxID").value
        );

        if (selectedTaxValue.length > 0) {
          entryListArray.controls[index]
            .get("TaxAmount")
            .setValue(
              entryListArray.controls[index].get("Quantity").value *
                entryListArray.controls[index].get("PurchaseRate").value *
                (selectedTaxValue[0].Rate / 100)
            );
        }
        entryListArray.controls[index].get("Remarks").setValue("");
      }
      const length = this.entryArray.value.length;
      if (entryListArray.controls[length - 1].invalid) return;
      this.entryArray.push(this.addEntryList());
    }
  }

  handleLedgerChange(value, index): void {
    const selectedLedgerValue = this.gridServices.ledgerList.filter(
      (s) => s.LedgerID === value
    );
    const entryListArray = <FormArray>this.entryArray;
    if (selectedLedgerValue && selectedLedgerValue.length > 0) {
      entryListArray.controls[index]
        .get("LedgerBalance")
        .setValue(selectedLedgerValue[0].LedgerBalance);
      entryListArray.controls[index]
        .get("LedgerName")
        .setValue(selectedLedgerValue[0].LedgerName);
      entryListArray.controls[index]
        .get("LedgerCode")
        .setValue(selectedLedgerValue[0].LedgerCode);
      entryListArray.controls[index]
        .get("LedgerID")
        .setValue(selectedLedgerValue[0].LedgerID);
      if (selectedLedgerValue[0].LedgerID) {
        this.gridServices
          .getSubLedgerMin(selectedLedgerValue[0].LedgerID)
          .subscribe((response) => {
            const subLedger = entryListArray.controls[index] as FormGroup;
            subLedger.setControl(
              "TransactionSubLedger",
              this.setSubLedgerListArray(response.Entity)
            );
          });
      }
      if (this.voucherType == "BANK_RCPT") {
        entryListArray.controls[index].get("VoucherNumber").setValue(0);
        entryListArray.controls[index].get("ChequeNumber").setValue("");
        entryListArray.controls[index].get("VoucherType").setValue("BANK_RCPT");
        entryListArray.controls[index].get("ChequeDate").setValue(new Date());
      }

      const length = this.entryArray.value.length;
      if (entryListArray.controls[length - 1].invalid) return;

      this.entryArray.push(this.addEntryList());
    }
  }

  addNewProduct(): void {
    this.modalRef = this.modalService.show(AddProductComponent, this.config);
    this.modalRef.content.action = "Select";
  }

  openProductModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const entryListArray = this.entryArray as FormArray;
        entryListArray.controls[index]
          .get("ProductCode")
          .setValue(data.ProductCode);
        entryListArray.controls[index].get("CodeName").setValue(data.CodeName);
        entryListArray.controls[index]
          .get("ProductID")
          .setValue(data.ProductID);
        entryListArray.controls[index]
          .get("ProductName")
          .setValue(data.ProductName);

        entryListArray.controls[index].get("Quantity").setValue(1);

        // for sales invoice
        if (this.voucherType == "SALES" || this.voucherType == "SLS_RTN") {
          entryListArray.controls[index]
            .get("SalesRate")
            .setValue(data.SalesRate);
          entryListArray.controls[index]
            .get("Amount")
            .setValue(
              entryListArray.controls[index].get("SalesRate").value *
                entryListArray.controls[index].get("Quantity").value
            );
          entryListArray.controls[index].get("DiscPercentage").setValue(0);
          entryListArray.controls[index]
            .get("DiscountAmount")
            .setValue(
              entryListArray.controls[index].get("DiscPercentage").value *
                entryListArray.controls[index].get("Amount").value
            );
          entryListArray.controls[index]
            .get("NetAmount")
            .setValue(
              entryListArray.controls[index].get("Amount").value -
                entryListArray.controls[index].get("DiscountAmount").value
            );

          entryListArray.controls[index].get("TaxID").setValue(data.TaxID);
          const selectedTaxValue = this.gridServices.taxList.filter(
            (s) => s.ID === entryListArray.controls[index].get("TaxID").value
          );
          if (selectedTaxValue.length > 0) {
            entryListArray.controls[index]
              .get("TaxAmount")
              .setValue(
                entryListArray.controls[index].get("Quantity").value *
                  entryListArray.controls[index].get("SalesRate").value *
                  (selectedTaxValue[0].Rate / 100)
              );
          }

          entryListArray.controls[index]
            .get("QtyUnitID")
            .setValue(data.QtyUnitID);
          entryListArray.controls[index]
            .get("QtyUnitName")
            .setValue(data.QtyUnitName);
          entryListArray.controls[index].get("Remarks").setValue("");
        }

        // for sales invoice
        if (this.voucherType == "PURCH") {
          entryListArray.controls[index]
            .get("PurchaseRate")
            .setValue(data.PurchaseRate);
          entryListArray.controls[index]
            .get("Amount")
            .setValue(
              entryListArray.controls[index].get("PurchaseRate").value *
                entryListArray.controls[index].get("Quantity").value
            );
          entryListArray.controls[index].get("DiscPercentage").setValue(0);
          entryListArray.controls[index]
            .get("DiscountAmount")
            .setValue(
              entryListArray.controls[index].get("DiscPercentage").value *
                entryListArray.controls[index].get("Amount").value
            );
          entryListArray.controls[index]
            .get("NetAmount")
            .setValue(
              entryListArray.controls[index].get("Amount").value -
                entryListArray.controls[index].get("DiscountAmount").value
            );

          entryListArray.controls[index].get("TaxID").setValue(data.TaxID);

          const selectedTaxValue = this.gridServices.taxList.filter(
            (s) => s.ID === entryListArray.controls[index].get("TaxID").value
          );
          if (selectedTaxValue.length > 0) {
            entryListArray.controls[index]
              .get("TaxAmount")
              .setValue(
                entryListArray.controls[index].get("Quantity").value *
                  entryListArray.controls[index].get("PurchaseRate").value *
                  (selectedTaxValue[0].Rate / 100)
              );
          }

          entryListArray.controls[index]
            .get("QtyUnitID")
            .setValue(data.QtyUnitID);
          entryListArray.controls[index]
            .get("QtyUnitName")
            .setValue(data.QtyUnitName);
          entryListArray.controls[index].get("Remarks").setValue("");
        }
        //for sales Order
        if (this.voucherType == "SLS_ORDER") {
          entryListArray.controls[index]
            .get("UpdatedQuantity")
            .setValue(data.UpdatedQuantity);
          entryListArray.controls[index]
            .get("PenndingQuantity")
            .setValue(data.PenndingQuantity);
        }

        const length = this.entryArray.value.length;
        if (entryListArray.controls[length - 1].invalid) return;
        this.entryArray.push(this.addEntryList());
        this.getRelatedUnitList(data.ProductID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  openLedgerModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const entryListArray = this.entryArray as FormArray;
        entryListArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        entryListArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
        entryListArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        entryListArray.controls[index].get("LedgerID").setValue(data.LedgerID);
        if (this.voucherType == "BANK_RCPT") {
          entryListArray.controls[index]
            .get("VoucherNumber")
            .setValue(data.VoucherNumber);
          entryListArray.controls[index]
            .get("ChequeNumber")
            .setValue(data.ChequeNumber);
          entryListArray.controls[index]
            .get("VoucherType")
            .setValue(data.VoucherType);
          entryListArray.controls[index]
            .get("ChequeDate")
            .setValue(new Date(data.ChequeDate));
        }
        if (data.LedgerID) {
          this.gridServices
            .getSubLedgerMin(data.LedgerID)
            .subscribe((response) => {
              const subLedger = entryListArray.controls[index] as FormGroup;
              subLedger.setControl(
                "TransactionSubLedger",
                this.setSubLedgerListArray(response.Entity)
              );
            });
        }
        const length = this.entryArray.value.length;
        if (entryListArray.controls[length - 1].invalid) return;
        this.entryArray.push(this.addEntryList());
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  openSubLedgerModal(formGroup, rowIndex): void {
    this.modalRef = this.modalService.show(EntrySubLedgerComponent, {
      initialState: {
        getSubLedgerList: formGroup.controls[rowIndex].get(
          "TransactionSubLedger"
        ),
        ledgerName: formGroup.controls[rowIndex].get("LedgerName").value,
        rowIndex: rowIndex,
      },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-md",
    });
    this.modalRef.content.onSubmit.subscribe((data) => {
      const entryListArray = this.entryArray as FormArray;
      if (data.amountType == "Debit") {
        entryListArray.controls[data.rowIndex]
          .get("DrAmount")
          .setValue(data.totalAmount);
        entryListArray.controls[data.rowIndex].get("CrAmount").setValue(null);
        entryListArray.controls[data.rowIndex].get("CrAmount").enable();
      } else {
        entryListArray.controls[data.rowIndex]
          .get("CrAmount")
          .setValue(data.totalAmount);
        entryListArray.controls[data.rowIndex].get("DrAmount").setValue(null);
        entryListArray.controls[data.rowIndex].get("DrAmount").enable();
      }
      //Do after Close the Modal
    });
  }

  getRelatedUnitList(productCode): void {
    this.gridServices.getRelatedUnits(productCode).subscribe((response) => {
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
    const entryListArray = <FormArray>this.entryArray;
    if (entryListArray.invalid) return;
    this.entryArray.push(this.addEntryList());
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  addNewRow(event): void {
    this.submitted = true;
    this.rowSubmitted = true;
    const entryListArray = <FormArray>this.entryArray;
    // if (entryListArray.invalid) return;
    this.entryArray.push(this.addEntryList());
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  addEntryList(): FormGroup {
    if (this.voucherType == "SALES") {
      return this._fb.group({
        ID: [0],
        ProductCode: [""],
        ProductID: [""],
        ProductName: [""],
        CodeName: [""],
        Quantity: [0, Validators.required],
        QtyUnitID: [null, Validators.required],
        QtyUnitName: [""],
        SalesRate: ["", Validators.required],
        Amount: ["", Validators.required],
        VATAmount: [0],
        DiscPercentage: [0, Validators.required],
        DiscountAmount: [0, Validators.required],
        NetAmount: [0, Validators.required],
        TaxID: [null],
        TaxAmount: [""],
        Remarks: [""],
      });
    }
    if (this.voucherType == "CASH_RCPT") {
      return this._fb.group({
        ID: [0],
        MasterID: [0],
        LedgerID: [0],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        VoucherNumber: [""],
        Amount: [""],
        LedgerBalance: [""],
        VoucherType: [""],
        Remarks: [""],
      });
    }

    if (this.voucherType == "CASH_PMNT") {
      return this._fb.group({
        ID: [0],
        MasterID: [0],
        LedgerID: [0],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        LedgerBalance: [""],
        Amount: [""],
        Remarks: [""],
      });
    }

    if (this.voucherType == "JRNL") {
      return this._fb.group({
        TransactionSubLedger: this._fb.array([]),
        ID: [0],
        MasterID: [0],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        LedgerID: [""],
        DrAmount: [""],
        CrAmount: [""],
        LedgerBalance: [""],
        Remarks: [""],
      });
    }

    if (this.voucherType == "BANK_PMNT") {
      return this._fb.group({
        ID: [""],
        MasterID: [""],
        LedgerID: [""],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        ChequeNumber: [""],
        ChequeDate: [""],
        LedgerBalance: [""],
        Amount: [""],
        Remarks: [""],
      });
    }
    if (this.voucherType == "BANK_RCPT") {
      return this._fb.group({
        ID: [0],
        MasterID: [0],
        LedgerID: [0],
        LedgerCode: [""],
        LedgerName: [""],
        VoucherNumber: [""],
        ChequeNumber: [""],
        ChequeBank: [""],
        ChequeDate: [""],
        Amount: [""],
        LedgerBalance: [""],
        VoucherType: [""],
        Remarks: [""],
      });
    }
    if (this.voucherType == "BRECON") {
      return this._fb.group({
        ID: [0],
        MasterID: [null],
        LedgerID: [null, Validators.required],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        DrCr: [""],
        LedgerBalance: [""],
        Amount: [0],
        Remarks: [""],
      });
    }
    if (this.voucherType == "CNTR") {
      return this._fb.group({
        ID: [0],
        LedgerCode: [""],
        LedgerName: ["", Validators.required],
        VoucherNo: ["", [Validators.required]],
        Amount: [""],
        LedgerBalance: [""],
        VoucherType: [""],
        Remarks: [""],
      });
    }
    if (this.voucherType == "SLS_ORDER") {
      return this._fb.group({
        ID: [0],
        SalesOrderID: [0],
        ProductCode: [""],
        ProductID: [null, Validators.required],
        ProductName: [""],
        Quantity: [null],
        SalesRate: [""],
        Amount: [""],
        UpdatedQuantity: [0],
        PenndingQuantity: [0],
      });
    }
    if (this.voucherType == "PURCH") {
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
    if (this.voucherType == "SLS_RTN") {
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
  }

  addSubLedgerFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      SubLedgerID: [null],
      Name: [""],
      Amount: [0],
      DrCr: [""],
      Remarks: [""],
    });
  }

  // this block of code is used to show form array data in the template.....
  setSubLedgerListArray(subLedgerList): FormArray {
    const subLedger = new FormArray([]);
    if (subLedgerList && subLedgerList.length > 0) {
      subLedgerList.forEach((element) => {
        subLedger.push(
          this._fb.group({
            ID: [null],
            SubLedgerID: [element.SubLedgerID],
            Name: [element.Name],
            Amount: [null],
            DrCr: [""],
            Remarks: [""],
          })
        );
      });
    }
    return subLedger;
  }

  productDDFilter(value, i): void {
    this.productList = this.gridServices.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );
  }

  ledgerDDFilter(value, i): void {
    this.ledgerList = this.gridServices.ledgerList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.ledgerList.filter(
      (s) => s.LedgerID === value
    );
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.entryArray);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const entryListArray = <FormArray>this.entryArray;
    // Remove the Row

    this.entryArray.removeAt(rowIndex);
  }

  removeRow(event, rowIndex): void {
    const entryListArray = <FormArray>this.entryArray;
    // Remove the Row
    this.entryArray.removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
