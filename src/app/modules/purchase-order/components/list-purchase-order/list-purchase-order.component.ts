import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-purchase-order",
  templateUrl: "./list-purchase-order.component.html",
  styleUrls: ["./list-purchase-order.component.scss"],
})
export class ListPurchaseOrderComponent implements OnInit {
  purchaseOrderForm: FormGroup;
  purchaseOrderList;
  listLoading: Boolean;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting Kendo Data
  public allowUnsort = true;
  modalRef: BsModalRef;
  //sorting Kendo Data

  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
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

  constructor(
    private _fb: FormBuilder,
    public purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildPurchaseOrderForm();
    this.getPurchaseOrderList();
  }

  buildPurchaseOrderForm(): void {
    this.purchaseOrderForm = this._fb.group({
      CashPartyLedgerID: [null],
      ProjectID: [null],
      Date: [""],
      OrderNo: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getPurchaseOrderList();
  }

  getPurchaseOrderList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };

    this.purchaseOrderService.getPurchaseOrderMaster(obj).subscribe(
      (response) => {
        this.purchaseOrderList = response.Entity.Entity;
        this.gridView = {
          data: this.purchaseOrderList,
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
    if (this.purchaseOrderForm.invalid) return;
    for (const key in this.purchaseOrderForm.value) {
      if (this.purchaseOrderForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.purchaseOrderForm.value[key],
        });
      }
    }
    this.getPurchaseOrderList();
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
    this.getPurchaseOrderList();
  }

  public edit(item): void {
    this.router.navigate(["/purchase-order/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem): void {
    const purchaseInvoiceID = {
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
        this.deletePurchaseOrderByID(purchaseInvoiceID.id);
      }
    });
  }

  public deletePurchaseOrderByID(id): void {
    this.purchaseOrderService.deletePurchaseById(id).subscribe(
      (response) => {
        this.getPurchaseOrderList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Purchase Order deleted successfully");
      }
    );
  }
}
