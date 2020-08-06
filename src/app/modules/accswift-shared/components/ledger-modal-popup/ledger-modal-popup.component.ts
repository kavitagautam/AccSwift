import { Component, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";

import { SortDescriptor } from "@progress/kendo-data-query";
import {
  SelectAllCheckboxState,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { LedgerListService } from "../../services/ledger-list/ledger-list.service";
import { LedgerLov } from "@app/modules/ledger/models/ledger.models";

@Component({
  selector: "accSwift-ledger-modal-popup",
  templateUrl: "./ledger-modal-popup.component.html",
  styleUrls: ["./ledger-modal-popup.component.scss"],
})
export class LedgerModalPopupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public onSelected: Subject<boolean>;
  ledgerList: LedgerLov[] = [];
  ledgerListLoading: boolean;

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  selected: any;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc",
    },
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select
  constructor(
    public bsModalRef: BsModalRef,
    private ledgerService: LedgerListService
  ) {}

  public ngOnInit(): void {
    this.getLedgerList();
    this.onClose = new Subject();
    this.onSelected = new Subject();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.ledgerService.getLedgerList().subscribe(
      (res) => {
        this.ledgerList = res.Entity;
      },
      (error) => {
        this.ledgerListLoading = false;
      },
      () => {
        this.ledgerListLoading = false;
      }
    );
  }

  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.ledgerList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    this.selected = this.ledgerList.filter(function (obj) {
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
    this.getLedgerList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  selectedLedger(item, selectedRow): void {
    this.onSelected.next(item);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}
