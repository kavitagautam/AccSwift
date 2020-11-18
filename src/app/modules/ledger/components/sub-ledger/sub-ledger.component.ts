import { OpeingBalanceComponent } from "@accSwift-modules/accswift-shared/components/opeing-balance/opeing-balance.component";
import { LedgerService } from "@accSwift-modules/ledger/services/ledger.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "accSwift-sub-ledger",
  templateUrl: "./sub-ledger.component.html",
  styleUrls: ["./sub-ledger.component.scss"],
})
export class SubLedgerComponent implements OnInit {
  @Input("") subLedgerList: FormArray;
  modelRefSubLedger: BsModalRef;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: number = undefined;
  constructor(
    private ledgerService: LedgerService,
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit() {}

  get getSubLedgerList(): FormArray {
    return <FormArray>this.subLedgerList;
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const openingList = <FormArray>this.subLedgerList;
    // Remove the Row
    openingList.removeAt(rowIndex);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.subLedgerList.invalid) return;
    (<FormArray>this.subLedgerList).push(this.addSubLedgerFormGroup());
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  addSubLedgerFormGroup(): FormGroup {
    return this._fb.group({
      LedgerID: [null],
      Name: [""],
      Code: [""],
      LedgerName: [""],
      IsActive: [false],
      IsBuiltIn: [false],
      OpenBalanceSubLedgers: this._fb.array([
        this.addSubLedgerBalanceFormGroup(),
      ]),
      CreatedBy: [""],
      CreatedDate: [new Date()],
      ModifiedBy: [""],
      ModifiedDate: [""],
      CompanyID: 0,
      Remarks: [""],
    });
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

  openingBalanceOfSubLedger(formGroup, rowIndex): void {
    this.modelRefSubLedger = this.modalService.show(OpeingBalanceComponent, {
      initialState: {
        subLedgerOpeingBalance: formGroup.controls[rowIndex].get(
          "OpenBalanceSubLedgers"
        ),
      },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
  }
}
