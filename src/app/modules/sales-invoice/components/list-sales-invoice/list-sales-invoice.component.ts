import { ConfirmationDialogComponent } from "./../../../../shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SalesInvoiceService } from "./../../services/sales-invoice.service";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { InvoiceDetail } from "../../models/sales-invoice.model";

@Component({
  selector: "accSwift-list-sales-invoice",
  templateUrl: "./list-sales-invoice.component.html",
  styleUrls: ["./list-sales-invoice.component.scss"]
})
export class ListSalesInvoiceComponent implements OnInit {
  salesInvoiceForm;
  salesInvoiceList;
  listLoading: Boolean;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  //sorting Kendo Data
  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  searchFilterList = [];
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    private fb: FormBuilder,
    public salesInvoiceService: SalesInvoiceService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildSalesInvoiceSearchForm();
    this.getSalesInvoiceList();
  }

  buildSalesInvoiceSearchForm() {
    this.salesInvoiceForm = this.fb.group({
      SeriesID: [null],
      CashPartyLedgerID: [null],
      SalesLedgerID: [null],
      DepotID: [null],
      ProjectID: [null],
      Date: [new Date()],
      OrderNo: [""]
    });
  }

  resetForm(): void {
    this.buildSalesInvoiceSearchForm();
    this.getSalesInvoiceList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getSalesInvoiceList();
  }

  getSalesInvoiceList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList
    };
    this.salesInvoiceService.getSalesInvoiceMaster(obj).subscribe(
      response => {
        this.salesInvoiceList = response.Entity.Entity;
        this.gridView = {
          data: this.salesInvoiceList,
          total: response.Entity.TotalItemsAvailable
        };
      },
      error => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  public searchForm(): void {
    this.searchFilterList = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.salesInvoiceForm.invalid) return;
    for (const key in this.salesInvoiceForm.value) {
      if (this.salesInvoiceForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.salesInvoiceForm.value[key]
        });
      }
    }
    this.getSalesInvoiceList();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    if (event.skip == 0) {
      this.skip = event.skip;
      this.currentPage = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.currentPage = pageNo;
    }
    this.getSalesInvoiceList();
  }

  public edit(item): void {
    this.router.navigate(["/sales-invoice/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const salesInvoiceID = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Voucher No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deletePaymentsByID(salesInvoiceID.id);
      }
    });
  }

  productList: InvoiceDetail[] = [];

  openProductModal(template: TemplateRef<any>, dataItem): void {
    this.productList = dataItem.InvoiceDetails;
    this.modalRef = this.modalService.show(template, this.config);
  }

  public deletePaymentsByID(id): void {
    this.salesInvoiceService.deleteSalesById(id).subscribe(
      response => {
        this.getSalesInvoiceList();
      },
      error => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Invoice deleted successfully");
      }
    );
  }
}
