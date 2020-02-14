import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { StockTransferService } from "./../../services/stock-transfer.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { SalesOrderService } from "@app/modules/sales-order/services/sales-order.service";

@Component({
  selector: "accSwift-list-stock-transfer",
  templateUrl: "./list-stock-transfer.component.html",
  styleUrls: ["./list-stock-transfer.component.scss"]
})
export class ListStockTransferComponent implements OnInit {
  stockTransferForm: FormGroup;
  stockTransferList: any;
  date: Date = new Date();
  listLoading: Boolean;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;

  orderByKey = "";
  dirKey = "asc";

  //Sorting Kendo Data
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
  modalService: BsModalService;

  constructor(
    private fb: FormBuilder,
    public stockTransferService: StockTransferService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildStockTransferForm();
    this.getStockTransferList();
  }

  buildStockTransferForm() {
    this.stockTransferForm = this.fb.group({
      series: [null],
      voucherNo: ["", [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromDepotLoc: [null],
      toDepotLoc: [null],
      remarks: [""]
    });
  }

  //Just using salesOrderService to make data visible.. Need to change it
  getStockTransferList(): void {
    //   this.listLoading = true;
    //   const params = {
    //     PageNo: this.currentPage,
    //     DisplayRow: this.pageSize,
    //     OrderBy: "",
    //     Direction: "asc"
    //   };
    //   this.stockTransferService.getSalesOrderMaster().subscribe(
    //     response => {
    //       this.listLoading = true;
    //       this.stockTransferList = response;
    //       this.gridView = {
    //         data: this.salesOrderList.slice(this.skip, this.skip + this.pageSize),
    //         total: this.salesOrderList ? this.salesOrderList.length : 0
    //       };
    //     },
    //     error => {
    //       this.listLoading = false;
    //     },
    //     () => {
    //       this.listLoading = false;
    //     }
    //   );
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    if (this.sort[0].field === "VoucherNo") {
      this.orderByKey = "Voucher_No";
    }
    if (this.sort[0].field === "Date") {
      this.orderByKey = "Journal_Date";
    }
    if (this.sort[0].field === "ProjectName") {
      this.orderByKey = "Project";
    }
    if (this.sort[0].field === "SeriesName") {
      this.orderByKey = "Series";
    }
    if (this.sort[0].field === "Remarks") {
      this.orderByKey = "Remarks";
    }
    this.getStockTransferList();
  }

  public filterChange(filter) {
    this.filter = filter;
    this.getStockTransferList();
  }

  public searchForm() {
    this.getStockTransferList();
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
    this.getStockTransferList();
  }

  public edit(dataItem): void {
    this.router.navigate(["/stock-transfer/edit", dataItem.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const stockTransferID = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Payments No. " + dataItem.VoucherNo;
    this.modalRef.content.action = "delete ";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteStockByID(stockTransferID.id);
      }
    });
  }

  deleteStockByID(id): void {
    this.toastr.success("Stock Transfer deleted successfully");
  }
}
