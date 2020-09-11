import { SalesReturnService } from "./../../services/sales-return.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { SalesReturn, ReturnDetail } from "../../models/sales-return.model";

@Component({
  selector: "accSwift-list-sales-return",
  templateUrl: "./list-sales-return.component.html",
  styleUrls: ["./list-sales-return.component.scss"],
})
export class ListSalesReturnComponent implements OnInit {
  salesReturnForm: FormGroup;
  salesReturnList: SalesReturn[] = [];

  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  listLoading: boolean;
  //sorting Kendo Data
  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  searchFilterList = [];
  //modal config to unhide modal when clicked outside
  modalRef: BsModalRef;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public salesReturnService: SalesReturnService
  ) {}

  ngOnInit(): void {
    this.buildSalesReturnForm();
    this.getSalesReturnList();
  }

  buildSalesReturnForm(): void {
    this.salesReturnForm = this._fb.group({
      SeriesID: [null],
      CashPartyLedgerID: [null],
      SalesLedgerID: [null],
      DepotID: [null],
      ProjectID: [null],
      Date: [""],
      OrderNo: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getSalesReturnList();
  }

  getSalesReturnList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };

    this.salesReturnService.getSalesReturnMaster(obj).subscribe(
      (response) => {
        this.salesReturnList = response.Entity.Entity;
        this.gridView = {
          data: this.salesReturnList,
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
    if (this.salesReturnForm.invalid) return;
    for (const key in this.salesReturnForm.value) {
      if (this.salesReturnForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.salesReturnForm.value[key],
        });
      }
    }
    this.getSalesReturnList();
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
    this.getSalesReturnList();
  }

  public edit(item): void {
    this.router.navigate(["/sales-return/edit", item.ID]);
  }

  productList: ReturnDetail[] = [];

  openProductModal(template: TemplateRef<any>, dataItem): void {
    this.productList = dataItem.ReturnDetails;
    this.modalRef = this.modalService.show(template, this.config);
  }
  openConfirmationDialogue(dataItem): void {
    const salesReturnID = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Sales " + dataItem.SalesLedgerID;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deletePaymentsByID(salesReturnID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.salesReturnService.deleteSalesById(id).subscribe(
      (response) => {
        this.getSalesReturnList();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error));
      },
      () => {
        this.toastr.success("Sales deleted successfully");
      }
    );
  }
}
