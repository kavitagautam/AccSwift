import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ProductModelPopupComponent } from "@app/shared/component/product-model-popup/product-model-popup.component";
import { RelatedUnits } from "../../models/sales-invoice.model";

@Component({
  selector: "accSwift-add-sales-invoice",
  templateUrl: "./add-sales-invoice.component.html",
  styleUrls: ["./add-sales-invoice.component.scss"]
})
export class AddSalesInvoiceComponent implements OnInit, OnDestroy {
  addInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  private editedRowIndex: number;
  relatedUnits: RelatedUnits[] = [];

  //Total Calculation
  myFormValueChanges$;
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
    class: "modal-lg"
  };
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public salesInvoiceService: SalesInvoiceService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildAddSalesInvoiceForm();

    this.myFormValueChanges$ = this.addInvoiceForm.controls[
      "InvoiceDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe(invoices => {
      // console.log("Value change " + JSON.stringify(invoices));
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
          sumDiscountAmount = sumNetAmount + invoices[i].DiscountAmount;
        }
        if (invoices && invoices[i].DiscPercentage) {
          sumTotalDiscountPer = sumNetAmount + invoices[i].DiscPercentage;
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
    });
  }

  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }

  buildAddSalesInvoiceForm(): void {
    this.addInvoiceForm = this._fb.group({
      SeriesID: ["", Validators.required],
      CashPartyLedgerID: [null],
      VoucherNo: [null, Validators.required],
      SalesLedgerID: [null],
      DepotID: [null],
      ProjectID: [null, Validators.required],
      Date: [new Date()],
      OrderNo: [""],
      Remarks: [""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()])
    });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ProductCode: [""],
      ProductName: ["", Validators.required],
      ProductID: [null, Validators.required],
      Quantity: ["", Validators.required],
      QtyUnitID: [null, Validators.required],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: ["", Validators.required],
      DiscountAmount: ["", Validators.required],
      NetAmount: ["", Validators.required],
      TaxID: [null],
      TaxAmount: [""],
      Remarks: [""]
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

          disabled: true
        }
      ],
      paidAmount: [""],
      returnAmount: [
        {
          value: "",

          disabled: true
        }
      ]
    });
    this.tenderForm.get("adjustAmount").valueChanges.subscribe(value => {
      const payableA =
        this.tenderForm.get("tenderAmount").value -
        this.tenderForm.get("adjustAmount").value;
      this.tenderForm.get("payableAmount").setValue(payableA);
    });
    this.tenderForm.get("paidAmount").valueChanges.subscribe(value => {
      const paidA =
        this.tenderForm.get("paidAmount").value -
        this.tenderForm.get("tenderAmount").value;
      this.tenderForm.get("returnAmount").setValue(paidA);
    });
  }

  public save(): void {
    if (this.addInvoiceForm.invalid) return;
    this.salesInvoiceService
      .addSalesInvoice(this.addInvoiceForm.value)
      .subscribe(
        response => {
          this.router.navigate(["/sales-invoice"]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice added successfully");
        }
      );
  }

  public cancel(): void {
    this.addInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.addInvoiceForm.get("InvoiceDetails");
  }

  changeQuantity(dataItem, index): void {
    const invoiceEntryArray = <FormArray>(
      this.addInvoiceForm.get("InvoiceDetails")
    );

    let qunatityValue = invoiceEntryArray.controls[index].get("Quantity").value;

    let salesRateValue = invoiceEntryArray.controls[index].get("SalesRate")
      .value;
    let discountPer = invoiceEntryArray.controls[index].get("DiscPercentage")
      .value;
    let discountAmountValue = invoiceEntryArray.controls[index].get(
      "DiscountAmount"
    ).value;
    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = discountPer * amountC;

    invoiceEntryArray.controls[index].get("Amount").setValue(amountC);

    // discount Amount Input
    if (discountAmountValue) {
      let calculatePercentage = discountAmountValue / amountC;
      invoiceEntryArray.controls[index]
        .get("DiscPercentage")
        .setValue(calculatePercentage);
      discountPer = calculatePercentage;
      discountAmountC = amountC * discountPer;
    }
    invoiceEntryArray.controls[index]
      .get("DiscountAmount")
      .setValue(discountAmountC);
    invoiceEntryArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);

    this.vatTotalAmount = discountAmountC * 0.13;
    this.grandTotalAmount =
      this.totalGrossAmount -
      this.totalDiscountAmount +
      this.vatTotalAmount +
      this.totalTaxAmount;
  }

  handleTaxChange(value, index): void {
    const selectedTaxValue = this.salesInvoiceService.taxList.filter(
      s => s.ID === value
    );
    const invoiceEntryArray = <FormArray>(
      this.addInvoiceForm.get("InvoiceDetails")
    );
    let netAmountV = invoiceEntryArray.controls[index].get("NetAmount").value;
    invoiceEntryArray.controls[index]
      .get("TaxAmount")
      .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const invoiceEntryArray = <FormArray>(
          this.addInvoiceForm.get("InvoiceDetails")
        );
        invoiceEntryArray.controls[index]
          .get("ProductCode")
          .setValue(data.Code);
        invoiceEntryArray.controls[index].get("ProductID").setValue(data.ID);
        invoiceEntryArray.controls[index]
          .get("ProductName")
          .setValue(data.Name);
        invoiceEntryArray.controls[index].get("Quantity").setValue(1);
        invoiceEntryArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.UnitID);
        invoiceEntryArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
        invoiceEntryArray.controls[index]
          .get("Amount")
          .setValue(
            data.SalesRate *
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
        this.getRelatedUnits(data.ID);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
      //Do after Close the Modal
    });
  }

  getRelatedUnits(productCode): void {
    this.salesInvoiceService
      .getRelatedUnits(productCode)
      .subscribe(response => {
        this.relatedUnits = response.Entity;
        console.log("Related Units" + JSON.stringify(this.relatedUnits));
      });
  }

  openTender(template: TemplateRef<any>): void {
    this.buildTenderForm();
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-sm"
    };
    this.modalRef = this.modalService.show(template, config);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>this.addInvoiceForm.get("InvoiceDetails");
    if (invoiceEntry.invalid) return;
    (<FormArray>this.addInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addInvoiceForm.get("InvoiceDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
