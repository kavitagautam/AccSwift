import { DatePipe } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { CashPaymentMaster } from "../../models/cash-payments.model";
import { CashPaymentsService } from "../../services/cash-payments.service";

@Component({
  selector: "app-list-cash-Payments",
  templateUrl: "./list-cash-Payments.component.html",
  styleUrls: ["./list-cash-Payments.component.scss"],
  providers: [DatePipe]
})
export class ListCashPaymentsComponent implements OnInit {
  cashPaymentsForm: FormGroup;
  cashPaymentMaster: CashPaymentMaster;
  listLoading: boolean;
  cashPaymentsList = [];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter
  date: Date = new Date();

  public gridData;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public cashPaymentsService: CashPaymentsService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.getCashPaymentslList();
    this.cashPaymentsForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      cashAccount: [""],
      date: [""]
    });
    this.cashPaymentsService.init();
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
    this.getCashPaymentslList();
  }

  getCashPaymentslList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };

    this.cashPaymentsService.getCashPaymentsMaster().subscribe(
      (res: any) => {

        this.listLoading = true;
        //mapping the data to change string date format to Date
        this.cashPaymentsList = res;
        console.log(res)
        this.gridView = {
          data: this.cashPaymentsList,
          total: this.cashPaymentsList ? this.cashPaymentsList.length : 0
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

    this.getCashPaymentslList();
  }

  public searchForm() {
    this.getCashPaymentslList();
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
    this.getCashPaymentslList();
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
    this.modalRef.content.data = "Payments No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deletePaymentsByID(journalId.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.toastr.success("Cash deleted successfully");
    //call Delete Api
  }
}
