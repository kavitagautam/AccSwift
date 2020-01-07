import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PurchaseReturnService } from './../../services/purchase-return.service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogComponent } from '@app/shared/component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: "app-list-purchase-return",
  templateUrl: "./list-purchase-return.component.html",
  styleUrls: ["./list-purchase-return.component.scss"]
})
export class ListPurchaseReturnComponent implements OnInit {
  purchaseReturnForm: FormGroup;
  purchaseReturnList;
  public filter: CompositeFilterDescriptor;
  public gridView: GridDataResult;
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
  listLoading: boolean;
  constructor(
    private fb: FormBuilder,
    public purchaseRetService: PurchaseReturnService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.buildListPurchaseReturnForm();
  }

  buildListPurchaseReturnForm() {
    this.purchaseReturnForm = this.fb.group({
      seriesId: [0],
      voucher: [""],
      date: [""],
      cashPartyACId: [0],
      depotLocationId: [0],
      orderNo: [""],
      purchaseACId: [0],
      projectId: [0],
      remarks: [""]
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
    this.getPurchaseReturnList();
  }

  getPurchaseReturnList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc"
    };

    this.purchaseRetService.getPurchaseOrderMaster().subscribe(
      res => {
        this.listLoading = true;
        this.purchaseReturnList = res;
        this.gridView = {
          data: this.purchaseReturnList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.purchaseReturnList ? this.purchaseReturnList.length : 0
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
    this.getPurchaseReturnList();
  }

  public searchForm() {
    this.getPurchaseReturnList();
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
    this.getPurchaseReturnList();
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
