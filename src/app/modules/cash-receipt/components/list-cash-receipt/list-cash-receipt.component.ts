import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CashReceiptService } from "../../services/cash-receipt.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { CashReceiptMaster } from "../../models/cash-receipt.model";

@Component({
  selector: "accSwift-list-cash-receipt",
  templateUrl: "./list-cash-receipt.component.html",
  styleUrls: ["./list-cash-receipt.component.scss"]
})
export class ListCashReceiptComponent implements OnInit {
  cashReceiptForm: FormGroup;
  listLoading: boolean;
  cashList: CashReceiptMaster[] = [];
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
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public cashReceiptService: CashReceiptService
  ) {}

  ngOnInit() {
    this.cashReceiptForm = this._fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: [""],
      cashAccountId: [null],
      cashPartyId: [null],
      date: [new Date()]
    });
    this.getCashReceiptlList();
  }

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

    this.cashReceiptService.getCashReceiptMaster().subscribe(
      res => {
        this.listLoading = true;
        //mapping the data to change string date format to Date
        this.cashList = res;
        this.gridView = {
          data: this.cashList.slice(this.skip, this.skip + this.pageSize),
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

  public searchForm(): void {
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

  openConfirmationDialogue(dataItem): void {
    const cashReceiptId = {
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
        this.deleteReceiptByID(cashReceiptId.id);
      }
    });
  }

  public deleteReceiptByID(id): void {
    this.toastr.success("Cash deleted successfully");
    //call Delete Api
  }
}
