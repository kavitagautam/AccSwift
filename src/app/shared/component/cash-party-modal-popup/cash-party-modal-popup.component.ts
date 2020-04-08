import { Component, OnInit } from "@angular/core";
import { SortDescriptor } from "@progress/kendo-data-query";
import {
  PageChangeEvent,
  SelectAllCheckboxState,
} from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import {
  CashPartyService,
  CashPartyList,
} from "@app/shared/services/cash-party-list/cash-party.service";

@Component({
  selector: "accSwift-cash-party-modal-popup",
  templateUrl: "./cash-party-modal-popup.component.html",
  styleUrls: ["./cash-party-modal-popup.component.scss"],
})
export class CashPartyModalPopupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public onSelected: Subject<boolean>;
  cashPartyList: CashPartyList[] = [];
  listLoading: boolean;

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  selected: any;
  public sort: SortDescriptor[] = [
    {
      field: "Name" || "Code" || "GroupName",
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
    this.cashPartyService.getCashPartyList().subscribe(
      (res) => {
        this.cashPartyList = res.Entity;
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
      return obj.ID == e[0];
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
  }

  selectedProduct(item, selectedRow): void {
    this.onSelected.next(item);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}
