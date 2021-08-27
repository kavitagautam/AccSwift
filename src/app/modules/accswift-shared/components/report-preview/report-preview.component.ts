import { Component, OnInit } from '@angular/core';
import { ExportToCsvService } from '@app/shared/services/export-to-csv/export-to-csv.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { IconConst } from "@shared/constants/icon.constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { SalesInvoiceService } from '@accSwift-modules/sales-invoice/services/sales-invoice.service';
import { Company } from '@accSwift-modules/company/models/company.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'accSwift-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {

  iconConst = IconConst;
  reportType: string;
  form: FormGroup;
  selectType: string;
  companyLogo: any = "";
  companyDetails: Company;
  
  cashFlowPreview: any = [];
  totalInFlowAmount: number;
  totalOutFlowAmount: number;

  bikriKhataList: any = [];
  sumTotalSalesAmt: number;
  sumNonTaxableSalesAmt: number;
  sumExport: number;
  sumTaxableAmount: number;
  sumTaxAmount: number;

  kharidKhataList: any = [];
  sumTotalPurchaseAmt: number;
  sumNonTaxableAmt: number;
  sumTaxablePurchaseAmt: number;
  sumTaxPurchaseAmt: number;
  sumTaxableSalesAmt: number;
  sumTaxSalesAmt: number;

  salesReportList: any = [];
  totalSalesQty: number;
  totalAmount: number;
  totalDiscountAmount: number;

  materializedViewList: any = [];
  sumGrossAmount: number;
  sumDiscount: number;
  // sumTaxAmount: number;
  sumTotalAmount: number;
  sumNetAmount: number;

  trialBalanceViewList: any = [];

  constructor(private exportService: ExportToCsvService,
    private localStorageService: LocalStorageService,
    private salesInvoiceService: SalesInvoiceService,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {

   
    this.salesInvoiceService.getCompanyDetails().subscribe((response) => {
      this.companyDetails = response.Entity;
      if (this.companyDetails) {
        this.companyLogo = this.companyDetails.Logo;
      }
    });  
      
    if (this.router.url.indexOf("/cash-flow-report") > -1) {
      this.reportType = "CASH_FLOW";
      let data;
      if (data) {
       this.cashFlowPreview = JSON.parse(localStorage.getItem("cashFlowReportPreview"));
      }
      this.totalInFlowAmount = JSON.parse(localStorage.getItem("totalInFlowAmount"));
      this.totalOutFlowAmount = JSON.parse(localStorage.getItem("totalOutFlowAmount"));
    }

    if (this.router.url.indexOf("/bikri-khata") > -1) {
      this.reportType = "BIKRI_KHATA";
      let data;
      if (data) {
        this.bikriKhataList = JSON.parse(localStorage.getItem("bikriKhataList")); 
      }
      console.log(this.bikriKhataList);
      this.sumTotalSalesAmt = JSON.parse(localStorage.getItem("sumTotalSalesAmt"));
      this.sumNonTaxableSalesAmt = JSON.parse(localStorage.getItem("sumNonTaxableSalesAmt"));
      this.sumExport = JSON.parse(localStorage.getItem("sumExport"));
      this.sumTaxableAmount = JSON.parse(localStorage.getItem("sumTaxableAmount"));
      this.sumTaxAmount = JSON.parse(localStorage.getItem("sumTaxAmount"));
    }

    if (this.router.url.indexOf("/kharid-khata") > -1) {
      this.reportType = "KHARID_KHATA";
      let data;
      if (data) {
        this.kharidKhataList = JSON.parse(localStorage.getItem("kharidKhataList")); 
      }
      console.log(this.kharidKhataList);
      this.sumTotalPurchaseAmt = JSON.parse(localStorage.getItem("sumTotalPurchaseAmt"));
      this.sumNonTaxableAmt = JSON.parse(localStorage.getItem("sumNonTaxableAmt"));
      this.sumTaxablePurchaseAmt = JSON.parse(localStorage.getItem("sumTaxablePurchaseAmt"));
      this.sumTaxPurchaseAmt = JSON.parse(localStorage.getItem("sumTaxPurchaseAmt"));
      this.sumTaxableSalesAmt = JSON.parse(localStorage.getItem("sumTaxableSalesAmt"));
      this.sumTaxSalesAmt = JSON.parse(localStorage.getItem("sumTaxSalesAmt"));
    }

    if (this.router.url.indexOf("/sales-report") > -1) {
      this.reportType = "SALES_PARTY_TRANSACT";
      let data;
      if (data) {
        this.salesReportList = JSON.parse(localStorage.getItem("salesReportList")); 
      }
      console.log(this.salesReportList);
      this.totalSalesQty = JSON.parse(localStorage.getItem("totalSalesQty"));
      this.totalAmount = JSON.parse(localStorage.getItem("totalAmount"));
      this.totalDiscountAmount = JSON.parse(localStorage.getItem("totalDiscountAmount"));
    }

    if (this.router.url.indexOf("/materialized-view") > -1) {
      this.reportType = "MATERIALIZED";
      let data;
      if (data) {
        this.materializedViewList = JSON.parse(localStorage.getItem("materializedViewList")); 
      }
      console.log(this.materializedViewList);
      this.sumGrossAmount = JSON.parse(localStorage.getItem("sumGrossAmount"));
      this.sumDiscount = JSON.parse(localStorage.getItem("sumDiscount"));
      this.sumTaxAmount = JSON.parse(localStorage.getItem("sumTaxAmount"));
      this.sumNetAmount = JSON.parse(localStorage.getItem("sumNetAmount"));
    }

    if (this.router.url.indexOf("/trail-balance") > -1) {
      this.reportType = "TRIAL";
      let data;
      if (data) {
        this.trialBalanceViewList = JSON.parse(localStorage.getItem("trialBalanceViewList"));
      }
    }

   }

  ngOnInit() {
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

  public onCancel(): void {
    this.modalRef.hide();
  }


}
