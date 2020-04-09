import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { IExport } from "@app/shared/models/iexport";
import { ExportToCsvService } from "@app/shared/services/export-to-csv/export-to-csv.service";
import { IconConst } from "@shared/constants/icon.constant";
import { MapCustomerInvoiceExportData } from "@app/shared/data/map-customer-invoice-export-data";
import { CustomerInvoiceExportColumnHeaders } from "@app/shared/models/customer-invoice-export-column-headers.model";
@Component({
  selector: "simpliflysaas-customer-invoices",
  templateUrl: "./customer-invoices.component.html",
  styleUrls: ["./customer-invoices.component.scss"],
})
export class CustomerInvoicesComponent implements OnInit {
  defaultImageUrl = environment.defaultImageUrl;
  iconConst = IconConst;
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

  customerDescription: any[];
  constructor(private exportService: ExportToCsvService) {}

  ngOnInit() {}

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
