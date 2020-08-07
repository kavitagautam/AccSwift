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
import { ProductMin } from "@app/modules/product/models/product-min.model";
import { ProductModalPopupComponent } from "../product-modal-popup/product-modal-popup.component";
import { LedgerModalPopupComponent } from "../ledger-modal-popup/ledger-modal-popup.component";
import { LocaleService } from "@app/core/services/locale/locale.services";
import { SettingsService } from "@app/modules/settings/services/settings.service";
import { IntlService, CldrIntlService } from "@progress/kendo-angular-intl";

@Component({
  selector: "accSwift-details-entry-grid",
  templateUrl: "./details-entry-grid.component.html",
  styleUrls: ["./details-entry-grid.component.scss"],
})
export class DetailsEntryGridComponent implements OnInit {
  relatedUnits: RelatedUnits[] = [];
  cashPartyList: CashParty[] = [];
  @ViewChild("anchor") public anchor: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup: ElementRef;
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  public productList: ProductMin[] = [];
  @Input("entryArray")
  public entryArray: FormArray;
  @Input("voucherType") public voucherType: string;
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
    public gridServices: DetailsEntryGridService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private _fb: FormBuilder,
    @Inject(LOCALE_ID) public localeId: string,
    public intlService: IntlService,
    private settingsService: SettingsService
  ) {
    // locale === "Nepali" ? "ne-NP" : "en_US"
    // this.localeService.set("en_US");
  }

  ngOnInit(): void {
    if (
      this.settingsService.settings &&
      this.settingsService.settings.DEFAULT_LANGUAGE.Value === "English"
    ) {
      this.localeId = "en_US";
    } else {
      this.localeId = "ne";
    }
    (<CldrIntlService>this.intlService).localeId = this.localeId;

    this.gridServices.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
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
    this.getRelatedUnitList(this.entryArray.value[rowIndex].ProductID);
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

  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const entryListArray = this.entryArray as FormArray;
    let qunatityValue = entryListArray.controls[index].get("Quantity").value;

    let salesRateValue = entryListArray.controls[index].get("SalesRate").value;
    let discountPer = entryListArray.controls[index].get("DiscPercentage")
      .value;

    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = (discountPer / 100) * amountC;
    entryListArray.controls[index]
      .get("DiscountAmount")
      .setValue(discountAmountC);

    entryListArray.controls[index].get("Amount").setValue(amountC);
    entryListArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);
  }

  //Change Discount Value
  discountAmountCalc(dataItem, index): void {
    const entryListArray = this.entryArray as FormArray;

    let discountAmountValue = entryListArray.controls[index].get(
      "DiscountAmount"
    ).value;
    let qunatityValue = entryListArray.controls[index].get("Quantity").value;

    let salesRateValue = entryListArray.controls[index].get("SalesRate").value;

    let amountC = qunatityValue * salesRateValue;
    let calculatePercentage = (discountAmountValue / amountC) * 100;
    entryListArray.controls[index]
      .get("DiscPercentage")
      .setValue(calculatePercentage);
    let discountPer = entryListArray.controls[index].get("DiscPercentage")
      .value;
    let discountAmountC = discountPer * amountC;

    discountPer = calculatePercentage;
    discountAmountC = amountC * discountPer;
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
    if (selectedTaxValue) {
      entryListArray.controls[index]
        .get("TaxAmount")
        .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
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
        .get("CodeName")
        .setValue(selectedProductValue[0].CodeName);
      entryListArray.controls[index]
        .get("ProductName")
        .setValue(selectedProductValue[0].ProductName);
      entryListArray.controls[index].get("Quantity").setValue(1);
      entryListArray.controls[index]
        .get("QtyUnitID")
        .setValue(selectedProductValue[0].QtyUnitID);
      entryListArray.controls[index]
        .get("QtyUnitName")
        .setValue(selectedProductValue[0].QtyUnitName);
      entryListArray.controls[index]
        .get("SalesRate")
        .setValue(selectedProductValue[0].SalesRate);

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

      entryListArray.controls[index]
        .get("TaxID")
        .setValue(selectedProductValue[0].TaxID);
      entryListArray.controls[index].get("TaxAmount").setValue("");
      entryListArray.controls[index].get("Remarks").setValue("");
      const length = this.entryArray.value.length;
      if (entryListArray.controls[length - 1].invalid) return;
      this.entryArray.push(this.addEntryList());
    }
  }

  addNewProduct(template: TemplateRef<any>): void {
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
        entryListArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.QtyUnitID);
        entryListArray.controls[index]
          .get("QtyUnitName")
          .setValue(data.QtyUnitName);
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
        entryListArray.controls[index]
          .get("TaxAmount")
          .setValue(data.TaxAmount);
        entryListArray.controls[index].get("Remarks").setValue("");
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
        const length = this.entryArray.value.length;
        if (entryListArray.controls[length - 1].invalid) return;
        this.entryArray.push(this.addEntryList());
      }

      // (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
      //   this.addCashReceiptEntryFormGroup()
      // );
    });
    this.modalRef.content.onClose.subscribe((data) => {
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

  addEntryList(): FormGroup {
    if (this.voucherType == "SALES") {
      return this._fb.group({
        ID: [0],
        ProductCode: [""],
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
  }

  productDDFilter(value, i): void {
    this.productList = this.gridServices.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
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

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
