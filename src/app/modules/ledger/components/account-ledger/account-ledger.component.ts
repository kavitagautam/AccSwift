import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { LedgerDetails } from "../../models/ledger.models";

@Component({
  selector: "app-account-ledger",
  templateUrl: "./account-ledger.component.html",
  styleUrls: ["./account-ledger.component.scss"]
})
export class AccountLedgerComponent implements OnInit, OnChanges {
  @ViewChild("openingBalanceModal") openingBalanceModal: ElementRef;
  @ViewChild("previousYearBalanceModal") previousYearBalanceModal: ElementRef;
  @Input("selectedItem") selectedItem;
  selectedLedgerId: number;
  accoutLedgerForm: FormGroup;
  ledgerDetails: LedgerDetails;

  rowSubmitted: boolean;
  submitted: boolean;
  private editedRowIndex: number;
  constructor(
    public _fb: FormBuilder,
    public ledgerService: LedgerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildAccountLedgerForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedLedgerId = this.selectedItem.ID;
    }

    if (this.selectedLedgerId) {
      this.getLedgerDetails();
    }
  }

  getLedgerDetails(): void {
    this.ledgerService
      .getLedgerDetails(this.selectedLedgerId)
      .subscribe(res => {
        this.ledgerDetails = res;
        this.buildAccountLedgerForm();
      });

  }

  buildAccountLedgerForm(): void {
    this.accoutLedgerForm = this._fb.group({
      ledgerCode: [this.ledgerDetails ? this.ledgerDetails.Code : ""],
      ledgerName: [
        this.ledgerDetails ? this.ledgerDetails.EngName : "",
        Validators.required
      ],
      accountHead: [""],
      remarks: [this.ledgerDetails ? this.ledgerDetails.Remarks : ""],
      currency: [
        this.ledgerDetails ? this.ledgerDetails.Currency : "",
        Validators.required
      ],
      date: [this.ledgerDetails ? this.ledgerDetails.CreatedDate : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      previousYearBalanceList: this._fb.array([
        this.addPreviousYearBalanceFormGroup()
      ])
    });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      accountClass: [""],
      openingBalance: [""],
      balanceType: [""]
    });
  }
  addPreviousYearBalanceFormGroup(): FormGroup {
    return this._fb.group({
      accountClass: [""],
      openingBalance: [""],
      balanceType: [""]
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("openingBalanceList");
  }

  get getPreviousYearBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("previousYearBalanceList");
  }

  openModal(index: number): void {}

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.accoutLedgerForm.get("openingBalanceList").invalid) return;
    (<FormArray>this.accoutLedgerForm.get("openingBalanceList")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.accoutLedgerForm.get("openingBalanceList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.accoutLedgerForm.get("openingBalanceList")).removeAt(
      rowIndex
    );
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public saveAccountLedger(): void {
    if (this.accoutLedgerForm.valid) {
      this.router.navigate(["/ledger"]);
    } else {
    }
  }

  public cancelAccountLedger(): void {
    this.accoutLedgerForm.reset();
    this.router.navigate(["/ledger"]);
  }
}
