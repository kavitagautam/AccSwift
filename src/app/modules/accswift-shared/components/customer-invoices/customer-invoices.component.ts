import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { IExport } from "@app/shared/models/iexport";
import { ExportToCsvService } from "@app/shared/services/export-to-csv/export-to-csv.service";
import { IconConst } from "@shared/constants/icon.constant";
import { MapCustomerInvoiceExportData } from "@app/shared/data/map-customer-invoice-export-data";
import { CustomerInvoiceExportColumnHeaders } from "@app/shared/models/customer-invoice-export-column-headers.model";
import { ActivatedRoute, Router } from "@angular/router";
import { SalesInvoiceService } from "@accSwift-modules/sales-invoice/services/sales-invoice.service";
import { Company } from "@accSwift-modules/company/models/company.model";
import { Store } from "@ngxs/store";
import { AddInvoiceDetails } from "@accSwift-modules/accswift-shared/state/sales-invoice.state";
@Component({
  selector: "simpliflysaas-customer-invoices",
  templateUrl: "./customer-invoices.component.html",
  styleUrls: ["./customer-invoices.component.scss"],
})
export class CustomerInvoicesComponent implements OnInit {
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
  voucherType: string;
  companyDetails: Company;
  invoiceDetails: any = [];
  journalDetails: any = [];
  cashDetails: any = [];
  bankDetails: any = [];
  customerDescription: any[];
  constructor(
    private exportService: ExportToCsvService,
    private route: ActivatedRoute,
    private router: Router,
    private salesInvoiceServices: SalesInvoiceService,
    private store: Store
  ) {
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
        this.journalDetails = data;
      }
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
    }
    if (this.router.url.indexOf("/cash-receipt") > -1) {
      this.voucherType = "CASH_RCPT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.cashDetails = data;
      }
    }
    if (this.router.url.indexOf("/cash-payment") > -1) {
      this.voucherType = "CASH_PMNT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.cashDetails = data;
      }
    }
    if (this.router.url.indexOf("/bank-receipt") > -1) {
      this.voucherType = "BANK_RCPT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.bankDetails = data;
      }
    }
    if (this.router.url.indexOf("/bank-payment") > -1) {
      this.voucherType = "BANK_PMNT";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
        this.bankDetails = data;
      }
    }
  }

  ngOnInit() {
    this.getIdFromRoute();
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

  public calculateDebitTotal(journalDetails): number {
    let debitTotalAmount = 0;
    for (let i = 0; i < journalDetails.length; i++) {
      if (
        journalDetails[i].Amount &&
        journalDetails[i].DebitCredit === "Debit"
      ) {
        debitTotalAmount = debitTotalAmount + journalDetails[i].Amount;
      }
    }
    return debitTotalAmount;
  }

  public calculateCreditTotal(journalDetails): number {
    let creditTotalAmount = 0;

    for (let i = 0; i < journalDetails.length; i++) {
      if (
        journalDetails[i].Amount &&
        journalDetails[i].DebitCredit == "Credit"
      ) {
        creditTotalAmount = creditTotalAmount + journalDetails[i].Amount;
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
