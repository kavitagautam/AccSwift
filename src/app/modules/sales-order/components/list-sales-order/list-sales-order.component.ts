import { SalesOrderMaster } from './../models/list-sales-order.model';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { FormGroup } from "@angular/forms";
import { SalesOrderService } from "./../../services/sales-order.service";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'accSwift-list-sales-order',
  templateUrl: './list-sales-order.component.html',
  styleUrls: ['./list-sales-order.component.scss']
})
export class ListSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  date: Date = new Date();
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
  salesOrderList: SalesOrderMaster[];
  modalService: BsModalService;

  constructor(
    private fb: FormBuilder,
    public salesOrderService: SalesOrderService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.buildSalesOrderForm();
  }

  buildSalesOrderForm() {
    this.salesOrderForm = this.fb.group({
      orderNo: [""],
      cashPartyACId: [0],
      remarks: [""],
      projectId: [0],
      date: [new Date()]
    });
  }
  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getSalesOrderList();
  }
  getSalesOrderList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc"
    };

    this.salesOrderService.getSalesOrderMaster().subscribe(
      res => {
        this.listLoading = true;
        this.salesOrderList = res;
        this.gridView = {
          data: this.salesOrderList.slice(this.skip, this.skip + this.pageSize),
          total: this.salesOrderList ? this.salesOrderList.length : 0
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
    this.getSalesOrderList();
  }

  public searchForm() {
    this.getSalesOrderList();
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
    this.getSalesOrderList();
  }

  public edit(item): void {
    this.router.navigate(["/sales-order/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const salesOrderID = {
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
        this.deletePaymentsByID(salesOrderID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.toastr.success("Sales Order deleted successfully");
    //call Delete Api
  }
}
