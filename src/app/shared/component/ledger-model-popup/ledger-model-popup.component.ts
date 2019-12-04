import { Component, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import {
  LedgerListService,
  LedgerList
} from "@app/shared/services/ledger-list.service";
import { SortDescriptor } from '@progress/kendo-data-query';
import { SelectAllCheckboxState, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: "app-ledger-model-popup",
  templateUrl: "./ledger-model-popup.component.html",
  styleUrls: ["./ledger-model-popup.component.scss"]
})
export class LedgerModelPopupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public onSelected: Subject<boolean>
  ledgerList: LedgerList[] = [];
  ledgerListLoading: boolean;

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  selected: any ;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
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
    this.onSelected=new Subject();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.ledgerService.getLedgerList().subscribe(
      res => {
        this.ledgerList = res;
      },
      error => {
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
  this.selected = this.ledgerList.filter(function(obj) {
      return obj.LedgerID == e[0];
    });
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
