import { Component, OnInit } from "@angular/core";
import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import {
  PageChangeEvent,
  SelectAllCheckboxState,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import {
  CashPartyService,
  CashParty,
} from "@app/shared/services/cash-party-list/cash-party.service";

@Component({
  selector: "accSwift-cash-party-modal-popup",
  templateUrl: "./cash-party-modal-popup.component.html",
  styleUrls: ["./cash-party-modal-popup.component.scss"],
})
export class CashPartyModalPopupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public onSelected: Subject<boolean>;
  cashPartyList: CashParty[] = [];
  listLoading: boolean;

  //kendo Grid
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter

  //Filter Serach Key

  orderByKey = "";
  dirKey = "asc";
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;

  searchFilterList: Array<any> = [];
  selected: any;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode",
      dir: "asc",
    },
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select
  constructor(
    public bsModalRef: BsModalRef,
    private cashPartyService: CashPartyService
  ) {}

  public ngOnInit(): void {
    this.getCashPartyList();
    this.onClose = new Subject();
    this.onSelected = new Subject();
  }

  getCashPartyList(): void {
    this.listLoading = true;

    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };

    this.cashPartyService.getCashPartyList(obj).subscribe(
      (response) => {
        this.cashPartyList = response.Entity.Entity;

        this.gridView = {
          data: this.cashPartyList,
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

  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.cashPartyList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    this.selected = this.cashPartyList.filter(function (obj) {
      return obj.LedgerID == e[0];
    });
    this.onSelected.next(this.selected[0]);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getCashPartyList();
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
    this.getCashPartyList();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filterArray = [];

      filter.filters.forEach(function (item) {
        filterArray.push({
          Field: item["field"],
          Operator: item["operator"],
          Value: item["value"],
        });
      });
      this.searchFilterList = filterArray;
    }
    this.getCashPartyList();
  }

  selectedProduct(item, selectedRow): void {
    this.onSelected.next(item);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}
