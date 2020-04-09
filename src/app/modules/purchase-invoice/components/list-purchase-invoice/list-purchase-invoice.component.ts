import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Component, OnInit } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-purchase-invoice",
  templateUrl: "./list-purchase-invoice.component.html",
  styleUrls: ["./list-purchase-invoice.component.scss"],
})
export class ListPurchaseInvoiceComponent implements OnInit {
  purchaseForm: FormGroup;
  purchaseInvoiceList = [];
  date: Date = new Date();
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
      dir: "asc",
    },
  ];
  modalRef: BsModalRef;
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

  ngOnInit() {
    this.buildPurchaseInvoiceForm();
    this.getPurchaseInvoiceList();
  }

  buildPurchaseInvoiceForm(): void {
    this.purchaseForm = this.fb.group({
      seriesId: [null],
      cashPartyACId: [null],
      purchaseAcId: [null],
      voucherNo: [""],
      partyBillNo: [""],
      depotLocationId: [null],
      projectId: [null],
      date: [new Date()],
      orderNo: [""],
      remarks: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getPurchaseInvoiceList();
  }

  getPurchaseInvoiceList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc",
    };

    this.purchaseService.getPurchaseInvoiceMaster().subscribe(
      (response) => {
        this.listLoading = true;
        this.purchaseInvoiceList = response;
        this.gridView = {
          data: this.purchaseInvoiceList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.purchaseInvoiceList ? this.purchaseInvoiceList.length : 0,
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
  public filterChange(filter): void {
    this.filter = filter;
    this.getPurchaseInvoiceList();
  }

  public searchForm() {
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
    this.purchaseService.deleteInvoiceById(id).subscribe(
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
