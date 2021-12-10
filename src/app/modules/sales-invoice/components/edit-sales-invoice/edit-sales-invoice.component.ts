import { SalesInvoiceDetails } from "../../models/sales-invoice.model";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { IconConst } from "@app/shared/constants/icon.constant";
import { BasicAddEditUserComponent } from "@accSwift-modules/accswift-shared/components/basic-add-edit-user/basic-add-edit-user.component";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { SelectEvent } from "@progress/kendo-angular-upload";
import { FileRestrictions } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-edit-sales-invoice",
  templateUrl: "../common-html/common-sales-invoice.html",
  // templateUrl: "../common-html/basic-sales-invoice.html",
  styleUrls: ["../common-html/sales-invoice.component.scss"],
})
export class EditSalesInvoiceComponent implements OnInit, OnDestroy {

  columns = [];
  public show: boolean = true;
  public myRestrictions: FileRestrictions = {
    maxFileSize: 5242880,
  };

  userType: string = localStorage.getItem("user_type");
  salesInvoiceForm: FormGroup;
  salesDetails: SalesInvoiceDetails;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean = false;
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
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  companyLogo: any = "";

  companyForm: FormGroup;
  amount = {
    thousand: 1000,
    fivehundred: 500,
    hundred: 100,
    fifty: 50,
    ten: 10,
    five: 5,
  }

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private productCodeMatch: ProductCodeValidatorsService
  ) {}

  ngOnInit(): void {
    this.getIdFromRoute();
    this.buildSalesInvoiceForm();
    this.salesInvoiceForm.valueChanges.subscribe((changes) => {
      this.invoiceValueChange(changes);
    });


    for (const key in this.salesInvoiceForm.controls.InvoiceDetails.value[0])
    {
      this.columns.push(key);
    }
  }

  productLoadEvent(event):void {
    if (event == true)
    {
      document.getElementById('productOverlay').style.display = 'block';
    }
    else if (event == false)
    {
      document.getElementById('productOverlay').style.display = 'none';
    }
  }

  totalAmount = 0;
  addAmount(amount):void {
    // var  click1 = (document.getElementById('1000')as HTMLInputElement).value;
    this.totalAmount += amount;
    this.tenderForm.get("paidAmount").setValue(this.totalAmount);
  }

  calculate(paidAmount) {
    console.log(paidAmount);
    this.tenderForm.get("paidAmount").setValue(paidAmount);
  }

  toggle() {
    this.show = !this.show;
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
      if (!file.validationErrors) {
        var reader = new FileReader();

        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.companyLogo = event.target.result;
          this.companyForm.get("Logo").setValue(this.companyLogo);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
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
      Date: [this.salesDetails ? new Date(this.salesDetails.Date) : ""],
      IsPay: [this.salesDetails ? this.salesDetails.IsPay : false],
      OrderNo: [this.salesDetails ? this.salesDetails.OrderNo : ""],
      TotalAmount: [this.salesDetails ? this.salesDetails.TotalAmount : 0],
      TotalQty: [this.salesDetails ? this.salesDetails.TotalQty : 0],
      Status: [this.salesDetails ? this.salesDetails.Status : ""],
      GrossAmount: [
        this.salesDetails ? this.salesDetails.GrossAmount : 0,
        Validators.required,
      ],
      NetAmount: [this.salesDetails ? this.salesDetails.NetAmount : 0],
      SpecialDiscount: [
        this.salesDetails ? this.salesDetails.SpecialDiscount : 0,
      ],
      VAT: [this.salesDetails ? this.salesDetails.VAT : 0],
      Remarks: [this.salesDetails ? this.salesDetails.Remarks : ""],
      TotalTCAmount: [this.salesDetails ? this.salesDetails.TotalTCAmount : 0],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()]),
    });
  }

  assignFormsValue(): void {
    this.salesInvoiceForm.get("ID").setValue(this.salesDetails.ID);
    this.salesInvoiceForm.get("SeriesID").setValue(this.salesDetails.SeriesID);
    this.salesInvoiceForm
      .get("VoucherNo")
      .setValue(this.salesDetails.VoucherNo);
    this.salesInvoiceForm
      .get("CashPartyLedgerID")
      .setValue(this.salesDetails.CashPartyLedgerID);
    this.salesInvoiceForm
      .get("ProjectID")
      .setValue(this.salesDetails.ProjectID);
    this.salesInvoiceForm.get("DepotID").setValue(this.salesDetails.DepotID);
    this.salesInvoiceForm
      .get("SalesLedgerID")
      .setValue(this.salesDetails.SalesLedgerID);

    this.salesInvoiceForm
      .get("Date")
      .setValue(new Date(this.salesDetails.CreatedDate));
    this.salesInvoiceForm.get("IsPay").setValue(this.salesDetails.IsPay);
    this.salesInvoiceForm.get("OrderNo").setValue(this.salesDetails.OrderNo);
    this.salesInvoiceForm
      .get("TotalAmount")
      .setValue(this.salesDetails.TotalAmount);
    this.salesInvoiceForm
      .get("SpecialDiscount")
      .setValue(this.salesDetails.SpecialDiscount);
    this.salesInvoiceForm.get("TotalQty").setValue(this.salesDetails.TotalQty);
    this.salesInvoiceForm
      .get("GrossAmount")
      .setValue(this.salesDetails.GrossAmount);
    this.salesInvoiceForm
      .get("TotalTCAmount")
      .setValue(this.salesDetails.TotalTCAmount);
    this.salesInvoiceForm
      .get("NetAmount")
      .setValue(this.salesDetails.NetAmount);
    this.salesInvoiceForm.get("VAT").setValue(this.salesDetails.VAT);
    this.salesInvoiceForm.get("Remarks").setValue(this.salesDetails.Remarks);
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
              //this.salesInvoiceForm.patchValue(this.salesDetails);
              this.assignFormsValue();
              this.setInvoiceList();
            }
          });
      }
    });
  }

  tenderForm: FormGroup;
  buildTenderForm(): void {
    this.tenderForm = this._fb.group({
      tenderAmount: [{ value: this.grandTotalAmount, disabled: true }],
      adjustAmount: [0],
      payableAmount: [
        {
          value: this.grandTotalAmount,
          disabled: true,
        },
      ],
      // paidAmount: [this.grandTotalAmount],
      paidAmount: [0.00],
      returnAmount: [
        {
          value: 0,
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

  get getInvoiceEntryList(): FormArray {
    return <FormArray>this.salesInvoiceForm.get("InvoiceDetails");
  }

  addInvoiceEntryList(): FormGroup {
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
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [null],
      TaxAmount: [""],
      Remarks: [""],
    });
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
            ProductCode: [element.ProductCode],
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
      });
    } else {
      invoiceFormArray.push(
        this._fb.group({
          ID: [0],
          ProductCode: [""],
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

  payInvoice(): void {
    this.salesInvoiceForm.get("IsPay").setValue(true);
    this.salesInvoiceForm.get("Status").setValue("PAID"); // Paid stutus
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

  exportToCSV() {
    const data = this.salesInvoiceForm.get("InvoiceDetails").value;
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    const csvArray = csv.join("\r\n");

    const a = document.createElement("a");
    const blob = new Blob([csvArray], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public save(): void {
    this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);
    this.salesInvoiceForm.get("TotalTCAmount").setValue(this.totalTaxAmount);

    this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
    this.salesInvoiceForm
      .get("SpecialDiscount")
      .setValue(this.totalDiscountAmount);

    //  if (this.salesInvoiceForm.invalid) return;
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

  publishInvoice(): void {
    this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);
    this.salesInvoiceForm.get("TotalTCAmount").setValue(this.totalTaxAmount);

    this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
    this.salesInvoiceForm.get("Status").setValue("UNPAID"); // publish button will change draft invoices to unpaid
    this.salesInvoiceForm
      .get("SpecialDiscount")
      .setValue(this.totalDiscountAmount);

    //  if (this.salesInvoiceForm.invalid) return;
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

  invoiceBilling(): void {
    this.router.navigate(
      [
        `/sales-invoice/edit/${
          this.salesInvoiceForm.get("ID").value
        }/invoice-billing`,
      ],
      { state: this.salesInvoiceForm.value }
    );
    localStorage.setItem(
      "invoices",
      JSON.stringify(this.salesInvoiceForm.value)
    );
  }

  addNewUser(): void {
    this.modalRef = this.modalService.show(
      BasicAddEditUserComponent,
      this.config
    );
    this.modalRef.content.action = "Select";
  }

  openTender(template: TemplateRef<any>): void {
    this.buildTenderForm();
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(template, config);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  removeInvoiceList(rowIndex): void {
    (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).removeAt(rowIndex);
  }
}
