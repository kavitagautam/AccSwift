import {
  BankPaymentDetailsList,
  BankPayment,
} from "./../../models/bank-payment.model";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BankPaymentService } from "./../../services/bank-payment.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { SortDescriptor } from "@progress/kendo-data-query";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-bank-payment",
  templateUrl: "./list-bank-payment.component.html",
  styleUrls: ["./list-bank-payment.component.scss"],
})
export class ListBankPaymentComponent implements OnInit {
  bankPaymentForm: FormGroup;
  public gridView: GridDataResult;
  bankPaymentList: BankPayment[];
  private toastr: ToastrService;
  modalRef: BsModalRef;
  listLoading: boolean;
  public skip = 0;
  public pageSize = 10;
  public currentPage = 1;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data

  config = {
    backdrop: true,
    ignoreBackDrop: true,
  };

  searchFilterList: Array<any> = [];

  constructor(
    public bankPaymentService: BankPaymentService,
    private _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildListBankPaymentForm();
    this.getBankPaymentList();
  }

  buildListBankPaymentForm(): void {
    this.bankPaymentForm = this._fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: [""],
      LedgerID: [null],
      Date: [""],
    });
  }

  getBankPaymentList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    this.bankPaymentService.getBankPaymentMaster(obj).subscribe(
      (response) => {
        this.bankPaymentList = response.Entity.Entity;
        this.gridView = {
          data: this.bankPaymentList,
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

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.currentPage = 1;
    this.skip = 0;
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
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

  ledgerList: BankPaymentDetailsList[] = [];

  openLedgerModal(template: TemplateRef<any>, dataItem): void {
    this.ledgerList = dataItem.BankPaymentDetailsList;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(dataItem): void {
    const journalId = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Receipt No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deletePaymentById(journalId.id);
      }
    });
  }

  public searchForm(): void {
    this.searchFilterList = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.bankPaymentForm.invalid) return;
    for (const key in this.bankPaymentForm.value) {
      if (this.bankPaymentForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.bankPaymentForm.value[key],
        });
      }
    }
    this.getBankPaymentList();
  }

  deletePaymentById(id): void {
    this.bankPaymentService.deleteBankPaymentByID(id).subscribe(
      (response) => {
        this.getBankPaymentList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Bank Payment deleted successfully");
      }
    );
  }
}
