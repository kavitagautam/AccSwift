import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CashReceiptMaster } from './../../../cash-receipts/models/cash-receipt.model';
import { CashPaymentsService } from "./../../Services/cash-payments.service";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ConfirmationDialogComponent } from '@app/shared/component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: "app-list-cash-payments",
  templateUrl: "./list-cash-payments.component.html",
  styleUrls: ["./list-cash-payments.component.scss"]
})
export class ListCashPaymentsComponent implements OnInit {
  public cashPaymentForm: FormGroup,
  listLoading: boolean;
  cashList: CashReceiptMaster[] = [];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter
  date: Date = new Date();
  constructor(
  
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public cashPaymentService: CashPaymentsService
  ) {}

  ngOnInit() {
    this.cashPaymentForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      bankAccount: [""],
      date: [""]
    });
    this.getCashReceiptlList();
    this.cashPaymentService.init();
  }
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  // Date string parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getCashReceiptlList();
  }

  getCashReceiptlList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };

    this.cashPaymentService.getCashReceiptMaster().subscribe(
      res => {
        this.listLoading = true;

        //mapping the data to change string date format to Date
        const sampleData = res.map(
          dataItem =>
            <CashReceiptMaster>{
              ID: dataItem.ID,
              SeriesID: dataItem.SeriesID,
              LedgerID: dataItem.LedgerID,
              VoucherNo: dataItem.VoucherNo,
              CashReceiptDate: this.parseAdjust(dataItem.CashReceiptDate),
              ProjectID: dataItem.ProjectID,
              Fields: {
                Field1: dataItem.Fields.Field1,
                Field2: dataItem.Fields.Field2,
                Field3: dataItem.Fields.Field3,
                Field4: dataItem.Fields.Field4,
                Field5: dataItem.Fields.Field5
              },
              IsPayByInvoice: dataItem.IsPayByInvoice,
              TotalAmount: dataItem.TotalAmount,
              Remarks: dataItem.Remarks,
              CreatedBy: dataItem.CreatedBy,
              CreatedDate: this.parseAdjust(dataItem.CreatedDate),
              ModifiedBy: dataItem.ModifiedBy,
              ModifiedDate: this.parseAdjust(dataItem.ModifiedDate)
            }
        );
        this.cashList = sampleData;
        this.gridView = {
          data: this.cashList,
          total: this.cashList ? this.cashList.length : 0
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

    this.getCashReceiptlList();
  }

  public searchForm() {
    this.getCashReceiptlList();
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
    this.getCashReceiptlList();
  }

  public edit(item): void {
    this.router.navigate(["/cashPayments/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const journalId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Receipt No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteReceiptByID(journalId.id);
      }
    });
  }

  public deleteReceiptByID(id): void {
    this.toastr.success("Cash deleted successfully");
    //call Delete Api
  }
}
