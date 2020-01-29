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
import { Component, OnInit } from "@angular/core";

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
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];
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
    this.buildListSalesForm();
    this.getSalesInvoiceList();
  }

  buildListSalesForm() {
    this.salesInvoiceForm = this.fb.group({
      seriesId: [null],
      cashPartyACId: [null],
      salesACId: [null],
      depotLocationId: [null],
      projectId: [null],
      date: [new Date()],
      orderNo: [""]
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getSalesInvoiceList();
  }

  getSalesInvoiceList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc"
    };

    this.salesInvoiceService.getSalesInvoiceMaster().subscribe(
      res => {
        this.listLoading = true;
        this.salesInvoiceList = res;
        this.gridView = {
          data: this.salesInvoiceList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.salesInvoiceList ? this.salesInvoiceList.length : 0
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

  public filterChange(filter) {
    this.filter = filter;
    this.getSalesInvoiceList();
  }

  public searchForm() {
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
    this.modalRef.content.data = "Payments No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deletePaymentsByID(salesInvoiceID.id);
      }
    });
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
