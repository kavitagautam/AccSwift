import { SubLedgerEntry } from "@accSwift-modules/accswift-shared/models/subledger.model";
import { LedgerService } from "@accSwift-modules/ledger/services/ledger.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-entry-sub-ledger",
  templateUrl: "./entry-sub-ledger.component.html",
  styleUrls: ["./entry-sub-ledger.component.scss"],
})
export class EntrySubLedgerComponent implements OnInit {
  @Input("getSubLedgerList") public getSubLedgerList: FormArray;
  @Input("ledgerName") public ledgerName: string;
  @Input("") rowIndex: number;
  public onClose = new Subject();
  public onSubmit = new Subject<SubLedgerEntry>();
  public amount = {
    type: null,
  };

  rowSubmitted: boolean;
  submitted: boolean;
  private editedRowIndex: number;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    public ledgerService: LedgerService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.onSubmit = new Subject<SubLedgerEntry>();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  public onSave(): void {
    if (this.amount.type == null) {
      alert("Please select Amount type");
      return;
    } else {
      this.onSubmit.next({
        totalAmount: this.calculateAmountTotal(),
        amountType: this.amount.type,
        rowIndex: this.rowIndex,
      });
      this.onClose.next(false);
      this.modalRef.hide();
    }
  }

  onDebitSelect(): void {
    const entryListArray = this.getSubLedgerList as FormArray;
    for (let i = 0; i < entryListArray.length; i++) {
      entryListArray.controls[i].get("DrCr").setValue("Debit");
    }
  }

  onCreditSelect(): void {
    const entryListArray = this.getSubLedgerList as FormArray;
    for (let i = 0; i < entryListArray.length; i++) {
      entryListArray.controls[i].get("DrCr").setValue("Credit");
    }
  }

  public calculateAmountTotal(): number {
    const entryListArray = this.getSubLedgerList.value;
    let amountTotal = 0;

    for (let i = 0; i < entryListArray.length; i++) {
      amountTotal = amountTotal + parseInt(entryListArray[i].Amount);
    }

    return amountTotal;
  }
}
