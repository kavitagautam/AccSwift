import { Component, OnInit } from '@angular/core';
import { ExportToCsvService } from '@app/shared/services/export-to-csv/export-to-csv.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { IconConst } from "@shared/constants/icon.constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { SalesInvoiceService } from '@accSwift-modules/sales-invoice/services/sales-invoice.service';
import { Company } from '@accSwift-modules/company/models/company.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'accSwift-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {

  iconConst = IconConst;
  reportType: string;
  cashFlowPreview: any = [];
  totalInFlowAmount: number;
  totalOutFlowAmount: number;
  companyLogo: any = "";
  companyDetails: Company;
  bikriKhataList: any = [];
  sumTotalSalesAmt: number;
  sumNonTaxableSalesAmt: number;
  sumExport: number;
  sumTaxableAmount: number;
  sumTaxAmount: number;

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
      this.sumTotalSalesAmt = JSON.parse(localStorage.getItem("sumTotalSalesAmt"));
      this.sumNonTaxableSalesAmt = JSON.parse(localStorage.getItem("sumNonTaxableSalesAmt"));
      this.sumExport = JSON.parse(localStorage.getItem("sumExport"));
      this.sumTaxableAmount = JSON.parse(localStorage.getItem("sumTaxableAmount"));
      this.sumTaxAmount = JSON.parse(localStorage.getItem("sumTaxAmount"));
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
