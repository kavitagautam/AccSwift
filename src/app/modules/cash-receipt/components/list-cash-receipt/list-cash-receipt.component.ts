import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CashReceiptService } from "../../services/cash-receipt.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import {
  CashReceiptList,
  CashReceiptDetail,
} from "../../models/cash-receipt.model";

@Component({
  selector: "accSwift-list-cash-receipt",
  templateUrl: "./list-cash-receipt.component.html",
  styleUrls: ["./list-cash-receipt.component.scss"],
})
export class ListCashReceiptComponent implements OnInit {
  cashReceiptForm: FormGroup;
  listLoading: boolean;
  cashReceiptList: CashReceiptList[] = [];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter
  date: Date = new Date();
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
    public cashReceiptService: CashReceiptService
  ) {}

  ngOnInit(): void {
    this.cashReceiptForm = this._fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: [""],
      LedgerID: [null],
      Date: [""],
    });
    this.getCashReceiptlList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.currentPage = 1;
    this.skip = 0;
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getCashReceiptlList();
  }

  getCashReceiptlList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey, // "asc" or "desc"
    };

    this.cashReceiptService.getCashReceiptMaster(obj).subscribe(
      (response) => {
        this.cashReceiptList = response.Entity.Entity;
        this.gridView = {
          data: this.cashReceiptList,
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
    if (this.cashReceiptForm.invalid) return;
    for (const key in this.cashReceiptForm.value) {
      if (this.cashReceiptForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.cashReceiptForm.value[key],
        });
      }
    }
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
    this.router.navigate(["/cash-receipt/edit", item.ID]);
  }

  ledgerList: CashReceiptDetail[] = [];

  openLedgerModal(template: TemplateRef<any>, dataItem): void {
    this.ledgerList = dataItem.CashReceiptDetails;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(dataItem): void {
    const cashReceiptId = {
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
        this.deleteReceiptByID(cashReceiptId.id);
      }
    });
  }

  public deleteReceiptByID(id): void {
    this.cashReceiptService.deleteCashReceiptByID(id).subscribe(
      (response) => {
        this.getCashReceiptlList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Cash receipt deleted successfully");
      }
    );
  }
}
