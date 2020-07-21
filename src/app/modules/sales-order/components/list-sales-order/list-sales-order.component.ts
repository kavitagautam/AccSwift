import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { FormGroup } from "@angular/forms";
import { SalesOrderService } from "./../../services/sales-order.service";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { SalesOrderList, CashParty } from "../../models/sales-order.model";
import { CashPartyModalPopupComponent } from "@app/modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";

@Component({
  selector: "accSwift-list-sales-order",
  templateUrl: "./list-sales-order.component.html",
  styleUrls: ["./list-sales-order.component.scss"],
})
export class ListSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  listLoading: Boolean;
  cashPartyList: CashParty[] = [];

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
      dir: "asc",
    },
  ];

  searchFilterList = [];
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  salesOrderList: SalesOrderList[];
  modalService: BsModalService;

  constructor(
    private _fb: FormBuilder,
    public salesOrderService: SalesOrderService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.salesOrderService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
  }

  ngOnInit(): void {
    this.buildSalesOrderForm();
    this.getSalesOrderList();
  }

  buildSalesOrderForm(): void {
    this.salesOrderForm = this._fb.group({
      OrderNo: [""],
      CashPartyLedgerID: [null],
      ProjectID: [null],
      Date: [""],
      Remarks: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getSalesOrderList();
  }

  getSalesOrderList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };

    this.salesOrderService.getSalesOrderMaster(obj).subscribe(
      (response) => {
        this.salesOrderList = response.Entity.Entity;
        this.gridView = {
          data: this.salesOrderList,
          total: response.Entity.TotalItemsAvailable,
        };
      },
      (error) => {
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
    if (this.salesOrderForm.invalid) return;
    for (const key in this.salesOrderForm.value) {
      if (this.salesOrderForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.salesOrderForm.value[key],
        });
      }
    }
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
  // Filterable Cash Party Drop-down
  cashPartyDDFilter(value): void {
    this.cashPartyList = this.salesOrderService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  openCashPartyModel(): void {
    this.modalRef = this.modalService.show(
      CashPartyModalPopupComponent,
      this.config
    );
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        // Do After the the sucess
        this.salesOrderForm.get("CashPartyLedgerID").setValue(data.LedgerID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  openConfirmationDialogue(dataItem): void {
    const salesOrderID = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Payments No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteOrderByID(salesOrderID.id);
      }
    });
  }

  public deleteOrderByID(id): void {
    this.salesOrderService.deleteSalesById(id).subscribe(
      (response) => {
        this.getSalesOrderList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Sales Order deleted successfully");
      }
    );
  }
}
