import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CashPaymentService } from "../../services/cash-payment.service";
import { CashPaymentList } from "../../models/cash-payment.model";

@Component({
  selector: "accSwift-list-cash-payment",
  templateUrl: "./list-cash-payment.component.html",
  styleUrls: ["./list-cash-payment.component.scss"],
})
export class ListCashPaymentComponent implements OnInit {
  cashPaymentsForm: FormGroup;
  listLoading: boolean;
  cashPaymentList: CashPaymentList[] = [];
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
    public cashPaymentService: CashPaymentService
  ) {}

  ngOnInit(): void {
    this.cashPaymentsForm = this._fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: [""],
      cashPartyId: [null],
      cashAccountId: [null],
      date: [""],
    });
    this.getCashPaymentList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.currentPage = 1;
    this.skip = 0;
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getCashPaymentList();
  }

  getCashPaymentList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey, // "asc" or "desc"
      FilterList: this.searchFilterList,
    };

    this.cashPaymentService.getCashPaymentMaster(obj).subscribe(
      (response) => {
        this.cashPaymentList = response.Entity.Entity;
        this.gridView = {
          data: this.cashPaymentList,
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
    if (this.cashPaymentsForm.invalid) return;
    for (const key in this.cashPaymentsForm.value) {
      if (this.cashPaymentsForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.cashPaymentsForm.value[key],
        });
      }
    }
    this.getCashPaymentList();
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
    this.getCashPaymentList();
  }

  public edit(item): void {
    this.router.navigate(["/cash-payment/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem): void {
    const cashPaymentID = {
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
        this.deletePaymentsByID(cashPaymentID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.cashPaymentService.deleteCashPaymentByID(id).subscribe(
      (response) => {
        this.getCashPaymentList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Cash deleted successfully");
      }
    );
  }
}
