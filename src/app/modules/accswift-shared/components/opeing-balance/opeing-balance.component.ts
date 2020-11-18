import { LedgerService } from "@accSwift-modules/ledger/services/ledger.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-opeing-balance",
  templateUrl: "./opeing-balance.component.html",
  styleUrls: ["./opeing-balance.component.scss"],
})
export class OpeingBalanceComponent implements OnInit {
  @Input("subLedgerOpeingBalance") public subLedgerOpeingBalance: FormArray;

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

  public balanceType: Array<{ type: string; Name: string; id: number }> = [
    { type: "DEBIT", Name: "DEBIT", id: 1 },
    { type: "CREDIT", Name: "CREDIT", id: 2 },
  ];

  ngOnInit() {
    this.onClose = new Subject();
    this.onSubmit = new Subject();
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const openingList = <FormArray>(
      this.subLedgerOpeingBalance.get("OpenBalanceSubLedgers")
    );
    // Remove the Row
    openingList.removeAt(rowIndex);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.subLedgerOpeingBalance.invalid) return;
    (<FormArray>this.subLedgerOpeingBalance).push(
      this.addSubLedgerBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  addSubLedgerBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      SubLedgerID: [null],
      AccClassID: [
        this.ledgerService.accountClass.length > 0
          ? this.ledgerService.accountClass[0].ID
          : null,
        Validators.required,
      ],
      OpenBal: [""],
      OpenBalDrCr: [""],
      OpenBalDate: [new Date()],
      OpenBalCCYID: [""],
    });
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}
