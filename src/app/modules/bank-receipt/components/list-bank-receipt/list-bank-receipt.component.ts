import { Component, OnInit, TemplateRef } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {
  BankReceiptList,
  BankReceiptDetailsList,
} from "../../models/bank-receipt.model";

@Component({
  selector: "accswift-list-bank-receipt",
  templateUrl: "./list-bank-receipt.component.html",
  styleUrls: ["./list-bank-receipt.component.scss"],
})
export class ListBankReceiptComponent implements OnInit {
  bankReceiptForm: FormGroup;
  date: Date = new Date();
  listLoading: boolean;
  bankReceiptList: BankReceiptList[] = [];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  orderByKey = "";
  dirKey = "asc";

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  searchFilterList: Array<any> = [];

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public bankReceiptService: BankReceiptService
  ) {}

  ngOnInit(): void {
    this.bankReceiptForm = this._fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: [""],
      bankAccountId: [null],
      date: [new Date()],
    });
    this.getBankReceiptlList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.currentPage = 1;
    this.skip = 0;
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getBankReceiptlList();
  }

  getBankReceiptlList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey, // "asc" or "desc"
      FilterList: this.searchFilterList,
    };
    this.bankReceiptService.getBankReceiptMaster(obj).subscribe(
      (response) => {
        this.bankReceiptList = response.Entity.Entity;
        this.gridView = {
          data: this.bankReceiptList,
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
    if (this.bankReceiptForm.invalid) return;
    for (const key in this.bankReceiptForm.value) {
      if (this.bankReceiptForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.bankReceiptForm.value[key],
        });
      }
    }
    this.getBankReceiptlList();
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
    this.getBankReceiptlList();
  }

  public edit(item): void {
    this.router.navigate(["/bank-receipt/edit", item.ID]);
  }

  ledgerList: BankReceiptDetailsList[] = [];

  openLedgerModal(template: TemplateRef<any>, dataItem): void {
    this.ledgerList = dataItem.BankReceiptDetailsList;
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
        this.deleteReceiptByID(journalId.id);
      }
    });
  }

  public deleteReceiptByID(id): void {
    this.bankReceiptService.deleteBankReceiptByID(id).subscribe(
      (response) => {
        this.getBankReceiptlList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Bank deleted successfully");
      }
    );
  }
}
