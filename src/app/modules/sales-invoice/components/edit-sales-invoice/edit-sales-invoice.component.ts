import {
  RelatedUnits,
  CashParty,
  SalesInvoiceDetails,
  ProductMinList,
} from "../../models/sales-invoice.model";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModalPopupComponent } from "@app/modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription, fromEvent } from "rxjs";
import { takeUntil, debounceTime, tap, take } from "rxjs/operators";
import { ProductCodeValidatorsService } from "@app/modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { CashPartyModalPopupComponent } from "@app/modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { AddProductComponent } from "@app/modules/accswift-shared/components/add-product/add-product/add-product.component";
import { IconConst } from "@app/shared/constants/icon.constant";

@Component({
  selector: "accSwift-edit-sales-invoice",
  templateUrl: "../common-html/common-sales-invoice.html",
  styleUrls: ["../common-html/sales-invoice.component.scss"],
})
export class EditSalesInvoiceComponent implements OnInit, OnDestroy {
  salesInvoiceForm: FormGroup;
  salesDetails: SalesInvoiceDetails;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean = false;
  relatedUnits: RelatedUnits[] = [];
  //Total Calculation
  myFormValueChanges$;
  iconConst = IconConst;
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
  public cashPartyList: CashParty[] = [];
  public productList: ProductMinList[] = [];
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
    private route: ActivatedRoute,
    public salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public productCodeMatch: ProductCodeValidatorsService
  ) {
    this.salesInvoiceService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
    this.salesInvoiceService.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
    });
  }

  ngOnInit(): void {
    this.buildSalesInvoiceForm();
    this.getIdFromRoute();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildSalesInvoiceForm(): void {
    this.salesInvoiceForm = this._fb.group({
      ID: this.salesDetails ? this.salesDetails.ID : 0,
      SeriesID: [
        this.salesDetails ? this.salesDetails.SeriesID : null,
        Validators.required,
      ],
      VoucherNo: [
        this.salesDetails ? this.salesDetails.VoucherNo : "",
        Validators.required,
      ],
      CashPartyLedgerID: [
        this.salesDetails ? this.salesDetails.CashPartyLedgerID : null,
        Validators.required,
      ],
      SalesLedgerID: [
        this.salesDetails ? this.salesDetails.SalesLedgerID : null,
        Validators.required,
      ],
      DepotID: [this.salesDetails ? this.salesDetails.DepotID : null],
      ProjectID: [this.salesDetails ? this.salesDetails.ProjectID : null],
      Date: [this.salesDetails ? new Date(this.salesDetails.CreatedDate) : ""],
      IsPay: [this.salesDetails ? this.salesDetails.IsPay : false],
      OrderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
      TotalAmount: [this.salesDetails ? this.salesDetails.TotalAmount : 0],
      TotalQty: [this.salesDetails ? this.salesDetails.TotalQty : 0],
      GrossAmount: [
        this.salesDetails ? this.salesDetails.GrossAmount : 0,
        Validators.required,
      ],
      NetAmount: [this.salesDetails ? this.salesDetails.NetAmount : 0],
      Remarks: [this.salesDetails ? this.salesDetails.Remarks : ""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()]),
    });
    this.myFormValueChanges$ = this.salesInvoiceForm.controls[
      "InvoiceDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe((changes) =>
      this.invoiceValueChange(changes)
    );
  }

  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.salesInvoiceService
          .getSalesInvoiceDetails(param)
          .subscribe((response) => {
            this.salesDetails = response.Entity;
            if (this.salesDetails) {
              this.totalGrossAmount = this.salesDetails.GrossAmount;
              this.totalNetAmount = this.salesDetails.NetAmount;
              this.totalQty = this.salesDetails.TotalQty;
              this.totalDiscountPercentage = this.salesDetails.SpecialDiscount;
              this.tenderAmount = this.salesDetails.TenderAmount;
              this.changeAmount = this.salesDetails.ChangeAmount;
              this.adjustmentAmount = this.salesDetails.AdjustmentAmount;
              this.vatTotalAmount = this.salesDetails.VAT;
              this.totalDiscountAmount =
                this.salesDetails.GrossAmount - this.salesDetails.NetAmount;
              this.grandTotalAmount = this.salesDetails.TotalAmount;
            }
            this.buildSalesInvoiceForm();
            this.setInvoiceList();
          });
      }
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

  private showUnitPopup: boolean = true;
  rowPopupIndexUnit: number;
  unitClick = false;
  taxClick = false;
  public unitPopup(number): void {
    this.unitClick = true;
    this.taxClick = false;
    this.rowPopupIndexUnit = number;
    this.showUnitPopup = !this.showUnitPopup;
  }

  private showTaxPopup: boolean = true;
  rowPopupIndexTax: number;

  public taxPopup(number): void {
    this.unitClick = false;
    this.taxClick = true;
    this.rowPopupIndexTax = number;
    this.showTaxPopup = !this.showTaxPopup;
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

  setInvoiceList(): void {
    this.salesInvoiceForm.setControl(
      "InvoiceDetails",
      this.setInvoiceDetailsFormArray(this.salesDetails.InvoiceDetails)
    );

    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
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
            ProductID: [element.ProductID],
            ProductName: [element.ProductName],
            CodeName: [element.CodeName],
            Quantity: [element.Quantity, Validators.required],
            QtyUnitID: [element.QtyUnitID, Validators.required],
            QtyUnitName: [element.QtyUnitName],
            SalesRate: [element.SalesRate, Validators.required],
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
          ProductID: [null],
          ProductName: [""],
          CodeName: [""],
          Quantity: ["", Validators.required],
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
        })
      );
    }
    return invoiceFormArray;
  }

  seriesValueChange(): void {
    const seriesChange = this.salesInvoiceForm.get("SeriesID").value;
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
      .updateSalesInvoice(this.salesInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-invoice"]);
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
    this.salesInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
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
    });

    this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);
    this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
  }

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
  }

  handelProductCode(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.salesInvoiceForm.get("InvoiceDetails")
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

          this.getRelatedUnitList(selectedItem[0].ID);
        }

        (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
          this.addInvoiceEntryList()
        );
      });
    }
  }

  cashPartyDDFilter(value): void {
    this.cashPartyList = this.salesInvoiceService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
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

      this.getRelatedUnitList(selectedProductValue[0].ProductID);
      (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
        this.addInvoiceEntryList()
      );
    }
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

        this.getRelatedUnitList(data.ProductID);
      }
    });

    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
    );
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  addNewProduct(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(AddProductComponent, this.config);
    this.modalRef.content.action = "Select";
    //this.modalRef = this.modalService.show(template, this.config);
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

  getRelatedUnitList(id): void {
    this.salesInvoiceService.getRelatedUnits(id).subscribe((response) => {
      this.relatedUnits = response.Entity;
    });
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.salesInvoiceForm.get("InvoiceDetails");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  removeInvoiceList(rowIndex): void {
    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
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
