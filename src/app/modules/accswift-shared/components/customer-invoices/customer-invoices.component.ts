import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { environment } from "@env/environment.prod";
import { IExport } from "@app/shared/models/iexport";
import { ExportToCsvService } from "@app/shared/services/export-to-csv/export-to-csv.service";
import { IconConst } from "@shared/constants/icon.constant";
import { MapCustomerInvoiceExportData } from "@app/shared/data/map-customer-invoice-export-data";
import { CustomerInvoiceExportColumnHeaders } from "@app/shared/models/customer-invoice-export-column-headers.model";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { SalesInvoiceService } from "@accSwift-modules/sales-invoice/services/sales-invoice.service";
import { Company } from "@accSwift-modules/company/models/company.model";
import { Store } from "@ngxs/store";
import { AddInvoiceDetails } from "@accSwift-modules/accswift-shared/state/sales-invoice.state";
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; //Render the viewport from current page


@Component({
  selector: "simpliflysaas-customer-invoices",
  templateUrl: "./customer-invoices.component.html",
  styleUrls: ["./customer-invoices.component.scss"],
})
export class CustomerInvoicesComponent implements OnInit {

  @ViewChild('htmlData') htmlData:ElementRef;
  @Input("settingsForms") public settingsForms:FormGroup;
  defaultImageUrl = environment.defaultImageUrl;
  iconConst = IconConst;
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalDiscountPercentage: number = 0;
  totalTaxAmount: number = 0;
  vatTotalAmount: number = 0;
  grandTotalAmount: number = 0;
  companyLogo: any = "";
  // select dropdown
  currencySign: string;
  voucherType: string;
  voucherDetails: any;
  companyDetails: Company;
  invoiceDetails: any = [];
  journalDetails: any = [];
  cashDetails: any = [];
  bankDetails: any = [];
  customerDescription: any[];
  voucherName: string;

  constructor(
    private exportService: ExportToCsvService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private salesInvoiceServices: SalesInvoiceService,
    private store: Store
  ) {
    this.router.events.subscribe((event) => {
      console.log(event)
      if (event instanceof NavigationEnd) {
        let routeParent = this.route.parent;
        console.log(this.route.parent)
        console.log(this.route.firstChild)
        this.voucherName = routeParent.snapshot.data["breadcrumb"];
      }
    });
    console.log(this.voucherName)
  
    this.currencySign = localStorage.getItem("currencySymbol");

    this.salesInvoiceServices.getCompanyDetails().subscribe((response) => {
      this.companyDetails = response.Entity;
      if (this.companyDetails) {
        this.companyLogo = this.companyDetails.Logo;
      }
    });

    if (this.router.url.indexOf("/journal") > -1) {
      this.voucherType = "JRNL";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.journalDetails = data.Journaldetails;
        this.voucherDetails = data;
      }
      console.log(this.journalDetails);
      console.log(this.voucherDetails);
    }
    if (this.router.url.indexOf("/sales-invoice") > -1) {
      this.voucherType = "SALES";
      const data = this.router.getCurrentNavigation().extras.state;
      const obj = {
        status: "invoices",
        InvoicesDetails: data,
      };

      // this.store.dispatch([new AddInvoiceDetails(data)]);
      //console.log("this the " + JSON.stringify(data));
      const data1 = JSON.parse(localStorage.getItem("invoices"));
      if (data1) {
        this.invoiceDetails = data1;
        this.calculateTotal(this.invoiceDetails);
      }
      console.log(this.invoiceDetails);
    }
    if (this.router.url.indexOf("/purchase-invoice") > -1) {
      this.voucherType = "PURCH";
      const data = this.router.getCurrentNavigation().extras.state;
      const obj = {
        status: "purchInvoices",
        InvoicesDetails: data,
      };

      // this.store.dispatch([new AddInvoiceDetails(data)]);
      // console.log("this the " + JSON.stringify(data));
      const data1 = JSON.parse(localStorage.getItem("purchInvoices"));
      if (data1) {
        this.invoiceDetails = data1;
        this.calculateTotal(this.invoiceDetails);
      }
    }
    if (this.router.url.indexOf("/cash-receipt") > -1) {
      this.voucherType = "CASH_RCPT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.cashDetails = data.CashReceiptDetails;
        this.voucherDetails = data;
      }
      console.log(this.cashDetails);
    }
    if (this.router.url.indexOf("/cash-payment") > -1) {
      this.voucherType = "CASH_PMNT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.cashDetails = data.CashPaymentDetailsList;
        this.voucherDetails = data;
      }
      console.log(this.cashDetails);
    }
    if (this.router.url.indexOf("/bank-receipt") > -1) {
      this.voucherType = "BANK_RCPT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.bankDetails = data.BankReceiptDetailsList;
        this.voucherDetails = data;
      }
    }
    if (this.router.url.indexOf("/bank-payment") > -1) {
      this.voucherType = "BANK_PMNT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.bankDetails = data.BankPaymentDetailsList;
        this.voucherDetails = data;
      }
      console.log(this.bankDetails);
    }

  }

  ngOnInit() {
    this.getIdFromRoute();
  }

  generatePDF(): void {
    let DATA = document.getElementById('htmlData');
      
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png') //Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
        let PDF = new jsPDF('p', 'mm', 'a4'); //Orientation, unit and format
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save('customer-billing-preview.pdf'); //Specify Filename
    });     
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
      }
    });
    const param = this.route.snapshot.queryParamMap;
    if (param.get("data")) {
      const data = param.get("data");
    }
  }

  exportToCSV() {
    // var exportData: IExport = {
    //   data: this.customerDescription.map((x) =>
    //     MapCustomerInvoiceExportData.mapCustomerInvoice(x)
    //   ),
    //   columnHeaders: CustomerInvoiceExportColumnHeaders.Columns,
    //   columnHeaderNotToBeIncluded: [],
    // };
    // this.exportService.ExportToCSV(exportData);
  }

  public calculateDebitTotal(journalDetails) {
    let debitTotalAmount = 0;
    for (let i = 0; i < journalDetails.length; i++) {
      if (
        journalDetails[i].DrAmount 
        // journalDetails[i].DebitCredit === "Debit"
      ) {
        debitTotalAmount = debitTotalAmount + journalDetails[i].DrAmount;
        // console.log(debitTotalAmount);
      }
    }
    return debitTotalAmount;
  }

  public calculateCreditTotal(journalDetails) {
    let creditTotalAmount = 0;
    for (let i = 0; i < journalDetails.length; i++) {
      if (
        journalDetails[i].CrAmount
        // journalDetails[i].DebitCredit == "Credit"
      ) {
        creditTotalAmount = creditTotalAmount + journalDetails[i].CrAmount;
        // console.log(creditTotalAmount);
      }
    }

    return creditTotalAmount;
  }

  calculateTotal(invoices): void {
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
        sumTotalDiscountPer = sumTotalDiscountPer + invoices[i].DiscPercentage;
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
  }
}
