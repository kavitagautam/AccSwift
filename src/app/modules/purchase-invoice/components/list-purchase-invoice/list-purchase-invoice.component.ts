import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor } from "@progress/kendo-data-query";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import {
  PurchaseInvoice,
  PurchInvoiceDetail,
} from "../../models/purchase-invoice.model";

@Component({
  selector: "accSwift-list-purchase-invoice",
  templateUrl: "./list-purchase-invoice.component.html",
})
export class ListPurchaseInvoiceComponent implements OnInit {
  purchaseForm: FormGroup;
  purchaseInvoiceList: PurchaseInvoice[] = [];
  date: Date = new Date();
  listLoading: Boolean;
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  modalRef: BsModalRef;
  //sorting Kendo Data

  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data

  searchFilterList = [];
  //sorting Kendo Data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  constructor(
    public purchaseService: PurchaseInvoiceService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildPurchaseInvoiceForm();
    this.getPurchaseInvoiceList();
  }

  buildPurchaseInvoiceForm(): void {
    this.purchaseForm = this.fb.group({
      SeriesID: [null],
      CashPartyLedgerID: [null],
      PurchaseLedgerID: [null],
      VoucherNo: [""],
      PartyBillNumber: [""],
      DepotID: [null],
      ProjectID: [null],
      Date: [""],
      OrderNo: [""],
      Remarks: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getPurchaseInvoiceList();
  }

  getPurchaseInvoiceList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    this.purchaseService.getPurchaseInvoiceMaster(obj).subscribe(
      (response) => {
        this.listLoading = true;
        this.purchaseInvoiceList = response.Entity.Entity;
        this.gridView = {
          data: this.purchaseInvoiceList,
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
    if (this.purchaseForm.invalid) return;
    for (const key in this.purchaseForm.value) {
      if (this.purchaseForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.purchaseForm.value[key],
        });
      }
    }
    this.getPurchaseInvoiceList();
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
    this.getPurchaseInvoiceList();
  }

  public edit(item): void {
    this.router.navigate(["/purchase-invoice/edit", item.ID]);
  }

  productList: PurchInvoiceDetail[] = [];

  openProductModal(template: TemplateRef<any>, dataItem): void {
    this.productList = dataItem.PurchInvoiceDetails;
    this.modalRef = this.modalService.show(template, this.config);
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
        this.deletePaymentsByID(purchaseInvoiceID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.purchaseService.deletePurchaseById(id).subscribe(
      (response) => {
        this.getPurchaseInvoiceList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Invoice deleted successfully");
      }
    );
  }
}
