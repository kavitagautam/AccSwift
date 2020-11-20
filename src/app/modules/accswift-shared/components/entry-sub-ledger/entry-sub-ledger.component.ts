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
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;
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
    this.onSubmit = new Subject();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}
