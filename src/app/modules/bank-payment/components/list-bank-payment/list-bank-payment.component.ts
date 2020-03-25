import { BankPaymentMaster } from "./../../models/bank-payment.model";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BankPaymentService } from "./../../services/bank-payment.service";
import { Component, OnInit } from "@angular/core";

import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-bank-payment",
  templateUrl: "./list-bank-payment.component.html",
  styleUrls: ["./list-bank-payment.component.scss"]
})
export class ListBankPaymentComponent implements OnInit {
  bankPaymentForm: FormGroup;
  public gridView: GridDataResult;
  bankPaymentList: BankPaymentMaster[];
  private toastr: ToastrService;
  modalRef: BsModalRef;
  private modalService: BsModalService;
  listLoading: boolean;
  public skip = 0;
  public pageSize = 10;
  public currentPage = 1;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  constructor(
    public bankPaymentService: BankPaymentService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildListBankPaymentForm();
    this.getBankPaymentList();
  }

  buildListBankPaymentForm() {
    this.bankPaymentForm = this.fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: [""],
      bankAccountId: [null],
      date: new Date()
    });
  }

  getBankPaymentList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };
    this.bankPaymentService.getBankPaymentMaster().subscribe(
      response => {
        this.bankPaymentList = response;
        console.log(response);
        this.gridView = {
          data: this.bankPaymentList,
          total: this.bankPaymentList ? this.bankPaymentList.length : 0
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

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getBankPaymentList();
  }

  public filter: CompositeFilterDescriptor;
  public filterChange(filter) {
    this.filter = filter;
    this.getBankPaymentList();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    if (event.skip == 0) {
      this.currentPage = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.currentPage = pageNo;
    }
    this.getBankPaymentList();
  }

  public edit(item): void {
    this.router.navigate(["/bank-payment/edit", item.ID]);
  }

  config = {
    backdrop: true,
    ignoreBackDrop: true
  };
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
        this.deletePaymentById(journalId.id);
      }
    });
  }

  public searchForm() {
    this.getBankPaymentList();
  }

  deletePaymentById(id): void {
    this.toastr.success("Bank Payment deleted successfully");
  }
}
