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
  payrollInvoiceList = [
    {
      id: 1,
      name: 3343,
    },
    {
      id: 2,
      name: 3222,
    },
  ];
  companyDetails: Company;
  invoiceDetails = [];
  customerDescription: any[];
  constructor(
    private exportService: ExportToCsvService,
    private route: ActivatedRoute,
    private router: Router,
    private salesInvoiceServices: SalesInvoiceService
  ) {
    this.salesInvoiceServices.getCompanyDetails().subscribe((response) => {
      this.companyDetails = response.Entity;
      if (this.companyDetails) {
        this.companyLogo = this.companyDetails.Logo;
      }
    });

    const data = JSON.parse(localStorage.getItem("invoices"));
    if (data) {
      this.invoiceDetails = data.InvoiceDetails;
      this.calculateTotal(this.invoiceDetails);
    }
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
    var exportData: IExport = {
      data: this.customerDescription.map((x) =>
        MapCustomerInvoiceExportData.mapCustomerInvoice(x)
      ),
      columnHeaders: CustomerInvoiceExportColumnHeaders.Columns,
      columnHeaderNotToBeIncluded: [],
    };
    this.exportService.ExportToCSV(exportData);
  }
}
