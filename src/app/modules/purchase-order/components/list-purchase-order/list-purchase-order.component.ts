import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-purchase-order",
  templateUrl: "./list-purchase-order.component.html",
  styleUrls: ["./list-purchase-order.component.scss"]
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
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];
  modalRef: BsModalRef;
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(
    private _fb: FormBuilder,
    public purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildPurchaseOrderForm();
    this.getPurchaseOrderList();
  }

  buildPurchaseOrderForm(): void {
    this.purchaseOrderForm = this._fb.group({
      cashPartyACId: [null],
      projectId: [null],
      date: [new Date()],
      orderNo: [""]
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getPurchaseOrderList();
  }

  getPurchaseOrderList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc"
    };

    this.purchaseOrderService.getPurchaseOrderMaster().subscribe(
      response => {
        this.listLoading = true;
        this.purchaseOrderList = response;
        this.gridView = {
          data: this.purchaseOrderList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.purchaseOrderList ? this.purchaseOrderList.length : 0
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
  public filterChange(filter): void {
    this.filter = filter;
    this.getPurchaseOrderList();
  }

  public searchForm() {
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

  openConfirmationDialogue(dataItem) {
    const purchaseInvoiceID = {
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
        this.deletePaymentsByID(purchaseInvoiceID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.toastr.success("Invoice deleted successfully");
    //call Delete Api
  }
}
