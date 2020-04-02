import { SalseInvoice, RelatedUnits } from "./../models/sales-invoice.model";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModelPopupComponent } from "@app/shared/component/product-model-popup/product-model-popup.component";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";

@Component({
  selector: "accSwift-edit-sales-invoice",
  templateUrl: "./edit-sales-invoice.component.html",
  styleUrls: ["./edit-sales-invoice.component.scss"]
})
export class EditSalesInvoiceComponent implements OnInit, OnDestroy {
  editInvoiceForm: FormGroup;
  salesDetails: SalseInvoice;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;
  relatedUnits: RelatedUnits[] = [];

  //Total Calculation
  myFormValueChanges$;

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
    private route: ActivatedRoute,
    public salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildEditInvoiceForm(): void {
    this.editInvoiceForm = this._fb.group({
      ID: this.salesDetails ? this.salesDetails.ID : 0,
      SeriesID: this.salesDetails ? this.salesDetails.SeriesID : "",
      VoucherNo: [
        this.salesDetails ? this.salesDetails.VoucherNo : null,
        Validators.required
      ],
      CashPartyLedgerID: this.salesDetails
        ? [this.salesDetails.CashPartyLedgerID, [Validators.required]]
        : null,
      SalesLedgerID: [
        this.salesDetails ? this.salesDetails.SalesLedgerID : null,
        [Validators.required]
      ],
      DepotID: [this.salesDetails ? this.salesDetails.DepotID : null],
      ProjectID: [this.salesDetails ? this.salesDetails.ProjectID : null],
      Date: [this.salesDetails ? new Date(this.salesDetails.CreatedDate) : ""],
      OrderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
      Remarks: [this.salesDetails ? this.salesDetails.Remarks : ""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()])
    });
    // this.editInvoiceForm.valueChanges
    //   .pipe(takeUntil(this.destroyed$), debounceTime(20))
    this.editInvoiceForm.controls["InvoiceDetails"].valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(20))
      .subscribe(invoices => {
        console.log("dsdasdas : " + JSON.stringify(invoices));
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
      });
  }

  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      const param = params.get("id");
      if (param) {
        this.salesInvoiceService
          .getSalesInvoiceDetails(param)
          .subscribe(response => {
            this.salesDetails = response.Entity;
            if (this.salesDetails) {
              this.totalGrossAmount = this.salesDetails.GrossAmount;
              this.totalNetAmount = this.salesDetails.NetAmount;
              this.totalQty = this.salesDetails.TotalQty;
              this.totalDiscountPercentage = this.salesDetails.SpecialDiscount;
              this.tenderAmount = this.salesDetails.TenderAmount;
              this.changeAmount = this.salesDetails.ChangeAmount;
              this.adjustmentAmount = this.salesDetails.AdjustmentAmount;
            }
            this.buildEditInvoiceForm();
            this.setInvoiceList();
          });
      }
    });
  }
  tenderForm: FormGroup;
  buildTenderForm(): void {
    this.tenderForm = this._fb.group({
      tenderAmount: [""],
      adjustAmount: [""],
      paidAmount: [""],
      returnAmount: [""]
    });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductCode: [""],
      ProductID: ["", Validators.required],
      ProductName: ["", Validators.required],
      Quantity: ["", Validators.required],
      QtyUnitID: ["", Validators.required],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [""],
      TaxAmount: [""],
      Remarks: [""]
    });
  }

  setInvoiceList(): void {
    this.editInvoiceForm.setControl(
      "InvoiceDetails",
      this.setInvoiceDetailsFormArray(this.salesDetails.InvoiceDetails)
    );
  }

  // this block of code is used to show form array data in the template.....
  setInvoiceDetailsFormArray(invoiceDetails): FormArray {
    const invoiceFormArray = new FormArray([]);
    if (invoiceDetails && invoiceDetails.length > 0) {
      invoiceDetails.forEach(element => {
        invoiceFormArray.push(
          this._fb.group({
            ID: [element.ID],
            ProductCode: [element.ProductCode],
            ProductName: [element.ProductName, Validators.required],
            ProductID: [element.ProductID, Validators.required],
            Quantity: [element.Quantity, Validators.required],
            QtyUnitID: [element.QtyUnitID, Validators.required],
            SalesRate: [element.SalesRate, Validators.required],
            Amount: [element.Amount, Validators.required],
            DiscPercentage: [element.DiscPercentage, Validators.required],
            DiscountAmount: [element.DiscountAmount, Validators.required],
            NetAmount: [element.NetAmount, Validators.required],
            TaxID: [element.TaxID],
            TaxAmount: [element.TaxAmount],
            Remarks: [element.Remarks]
          })
        );
        this.getRelatedUnitList(element.ProductID);
      });
    } else {
      invoiceFormArray.push(
        this._fb.group({
          ID: [0],
          ProductCode: [""],
          ProductName: ["", Validators.required],
          ProductID: [null, Validators.required],
          Quantity: ["", Validators.required],
          QtyUnitID: [null, Validators.required],
          SalesRate: ["", Validators.required],
          Amount: ["", Validators.required],
          DiscPercentage: [0, Validators.required],
          DiscountAmount: [0, Validators.required],
          NetAmount: [0, Validators.required],
          TaxID: [null],
          TaxAmount: [""],
          Remarks: [""]
        })
      );
    }
    return invoiceFormArray;
  }

  public save(): void {
    if (this.editInvoiceForm.invalid) return;
    this.salesInvoiceService
      .updateSalesInvoice(this.editInvoiceForm.value)
      .subscribe(
        response => {
          this.router.navigate(["/sales-invoice"]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice edited successfully");
        }
      );
  }

  public cancel(): void {
    this.editInvoiceForm.reset();
    this.router.navigate(["/sales-invoice"]);
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
          this.editInvoiceForm.get("InvoiceDetails")
        );
        invoiceEntryArray.controls[index]
          .get("ProductCode")
          .setValue(data.Code);
        invoiceEntryArray.controls[index].get("ProductID").setValue(data.ID);
        invoiceEntryArray.controls[index]
          .get("ProductName")
          .setValue(data.Name);
        invoiceEntryArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.UnitID);
        invoiceEntryArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
        this.getRelatedUnitList(data.ID);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
      //Do after Close the Modal
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

  getRelatedUnitList(id): void {
    this.salesInvoiceService.getRelatedUnits(id).subscribe(response => {
      this.relatedUnits = response.Entity;
    });
  }

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.editInvoiceForm.get("InvoiceDetails");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>this.editInvoiceForm.get("InvoiceDetails");
    if (invoiceEntry.invalid) return;
    (<FormArray>this.editInvoiceForm.get("InvoiceDetails")).push(
      this.addInvoiceEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editInvoiceForm.get("InvoiceDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
