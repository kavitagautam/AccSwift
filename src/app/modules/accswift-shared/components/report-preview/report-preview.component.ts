import { Component, OnInit } from '@angular/core';
import { ExportToCsvService } from '@app/shared/services/export-to-csv/export-to-csv.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { IconConst } from "@shared/constants/icon.constant";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";


@Component({
  selector: 'accSwift-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {
  iconConst = IconConst;
  reportType: string;
  cashFlowReportPreview: any[];
  cashFlowPreview: any = [];
  totalInFlowAmount: number;
  totalOutFlowAmount: number;


  constructor(private exportService: ExportToCsvService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {
      
    if (this.router.url.indexOf("/cash-flow-report") > -1) {
      this.reportType = "CASH_FLOW";
      const data = this.router.getCurrentNavigation().extras.state;
      if (data) {
       this.cashFlowPreview = JSON.parse(localStorage.getItem("cashFlowReportPreview"));
       this.cashFlowPreview = data; 
      }
      this.totalInFlowAmount = JSON.parse(localStorage.getItem("totalInFlowAmount"));
      this.totalOutFlowAmount = JSON.parse(localStorage.getItem("totalOutFlowAmount"));
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

}
