import { BankReconciliationMaster } from "./../models/bank-reconciliation.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { BankReconciliationService } from "./../../services/bank-reconciliation.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-list-bank-reconciliation",
  templateUrl: "./list-bank-reconciliation.component.html",
  styleUrls: ["./list-bank-reconciliation.component.scss"]
})
export class ListBankReconciliationComponent implements OnInit {
  bankReconciliationForm: FormGroup;
  date: Date = new Date();
  listLoading: Boolean;
  bankReconciliationList;
  private toastr: ToastrService;
  private modalService: BsModalService;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
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

  constructor(
    private fb: FormBuilder,
    public reconciliationService: BankReconciliationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildBankReconciliationForm();
    this.getBankReconciliationlList();
  }

  buildBankReconciliationForm() {
    this.bankReconciliationForm = this.fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: [""],
      bankAccountId: [null],
      date: [new Date()]
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getBankReconciliationlList();
  }

  getBankReconciliationlList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };
    this.reconciliationService.getBankReconciliationMaster().subscribe(
      response => {
        this.listLoading = true;
        this.bankReconciliationList = response;
        this.gridView = {
          data: this.bankReconciliationList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.bankReconciliationList
            ? this.bankReconciliationList.length
            : 0
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

    this.getBankReconciliationlList();
  }

  public searchForm() {
    this.getBankReconciliationlList();
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
    this.getBankReconciliationlList();
  }

  public edit(item): void {
    this.router.navigate(["/bank-reconciliation/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const bankId = {
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
        this.deleteBankReconciliationByID(bankId.id);
      }
    });
  }

  public deleteBankReconciliationByID(id): void {
    this.toastr.success("Bank deleted successfully");
    //call Delete Api
  }
}
