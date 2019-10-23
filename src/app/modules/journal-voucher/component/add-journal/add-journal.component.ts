import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import * as $ from "jquery";
import { Router } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe, formatDate } from "@angular/common";
import { LedgerList } from "../../models/journal.model";
import {
  GridDataResult,
  PageChangeEvent,
  SelectAllCheckboxState
} from "@progress/kendo-angular-grid";
import { SortDescriptor } from "@progress/kendo-data-query";
import { LedgerCodeMatchService } from "../../services/ledger-code-match.service";

@Component({
  selector: "app-add-journal",
  templateUrl: "./add-journal.component.html",
  styleUrls: ["./add-journal.component.scss"],
  providers: [DatePipe]
})
export class AddJournalComponent implements OnInit {
  @ViewChild("ledgerSelectModal") ledgerSelectModal: ElementRef;
  private editedRowIndex: number;

  //Input Field Property 
  public decimals: number = 2;
  numericFormat: string = "n3";
  
  addJournalForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  ledgerList: LedgerList[] = [];
  journalDate: Date = new Date();
  ledgerListLoading: boolean;

  debitTotal: number = 0;
  creditTotal: number = 0;
  selectedLedgerRow: number;
  differenceTotal: number = 0;

  //kendo Grid
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select

  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    public ledgerCodeMatchService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.journalService.init();
    this.buildAddJournalForm();
  }

  buildAddJournalForm(): void {
    this.addJournalForm = this._fb.group({
      seriesID: [""],
      seriesName: [""],
      voucherNo: [""],
      journalDate: [formatDate(new Date(), "yyyy-MM-dd", "en-US")],
      projectName: [""],
      narration: [""],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()])
    });
  }

  get getjournalEntryList(): FormArray {
    return <FormArray>this.addJournalForm.get("journalEntryList");
  }

  checkDebitValue(event: Event, index: number): void {
    let debitValue = 0;
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFormArray.controls[index].get("debit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFormArray.controls[index].get("credit").disable();
    } else {
      journalEntryFormArray.controls[index].get("credit").enable();
    }
    // calculate the total debit
    for (let j = 0; j < journalEntryFormArray.controls.length; j++) {
      debitValue =
        debitValue +
        (parseFloat(journalEntryFormArray.controls[j].get("debit").value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, index: number): void {
    let creditValue = 0;
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFormArray.controls[index].get("credit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFormArray.controls[index].get("debit").disable();
    } else {
      journalEntryFormArray.controls[index].get("debit").enable();
    }
    for (let j = 0; j < journalEntryFormArray.controls.length; j++) {
      creditValue =
        creditValue +
        (parseFloat(journalEntryFormArray.controls[j].get("credit").value) ||
          0);
    }
    this.creditTotal = creditValue;
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchService.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      ledgerID: [""],
      debit: ["", Validators.required],
      credit: [""],
      balance: [""],
      remarks: [""]
    });
  }

  addJournalEntry(): FormArray {
    this.submitted = true;
    if (this.addJournalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.addJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(index: number): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFormArray.controls[index].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFormArray.controls[index].get("debit").value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row
    (<FormArray>this.addJournalForm.get("journalEntryList")).removeAt(index);
  }

  changeLedgerValue(dataItem, selectedRow) {
    if (this.ledgerList && this.ledgerList.length > 0) {
      const journalEntryFormArray = <FormArray>(
        this.addJournalForm.get("journalEntryList")
      );

      const ledgerCode = journalEntryFormArray.controls[selectedRow].get(
        "ledgerCode"
      ).value;
      if (
        journalEntryFormArray.controls[selectedRow].get("ledgerCode").status ===
        "VALID"
      ) {
        this.journalService.checkLedgerCode(ledgerCode).subscribe(res => {
          const selectedItem = res.Entity;
          if (selectedItem && selectedItem.length > 0) {
            journalEntryFormArray.controls[selectedRow]
              .get("balance")
              .setValue(selectedItem[0].ActualBalance);
            journalEntryFormArray.controls[selectedRow]
              .get("balance")
              .disable();
            journalEntryFormArray.controls[selectedRow]
              .get("particularsOraccountingHead")
              .setValue(selectedItem[0].LedgerName);
            journalEntryFormArray.controls[selectedRow]
              .get("ledgerID")
              .setValue(selectedItem[0].LedgerID);
          }
        });
      }
    }
  }

  public save(): void {
    if (this.addJournalForm.valid) {
      this.router.navigate(["/journal"]);
    } else {
    }
  }

  public cancel(): void {
    this.addJournalForm.reset();
    this.router.navigate(["/journal"]);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }

  //Selected the Ledger row
  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.ledgerList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    const selected = this.ledgerList.filter(function(obj) {
      return obj.LedgerID == e[0];
    });

    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[selectedRow]
      .get("balance")
      .setValue(selected[0].ActualBalance);
    journalEntryFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(selected[0].LedgerName);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerID")
      .setValue(selected[0].LedgerID);
    this.ledgerSelectModal.nativeElement.click();
  }

  // select the Ledger column
  selectedLedger(item, selectedRow: number): void {
    console.log("item" + JSON.stringify(item));
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[selectedRow]
      .get("balance")
      .setValue(item.ActualBalance);
    journalEntryFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(item.LedgerName);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerID")
      .setValue(item.LedgerID);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerCode")
      .setValue(item.LedgerCode);
    this.ledgerSelectModal.nativeElement.click();
  }

  openModal(index: number): void {
    this.mySelection = [];
    this.selectedLedgerRow = index;
    this.getLedgerList();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.journalService.getLedgerList().subscribe(
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

  // knedo uI
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addJournalForm.get("journalEntryList").invalid) return;
    (<FormArray>this.addJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    journalEntryFormArray.controls[rowIndex]
      .get("ledgerID")
      .setValue(dataItem.ledgerID);
    journalEntryFormArray.controls[rowIndex]
      .get("debit")
      .setValue(dataItem.debit);
    journalEntryFormArray.controls[rowIndex]
      .get("credit")
      .setValue(dataItem.credit);
    journalEntryFormArray.controls[rowIndex]
      .get("balance")
      .setValue(dataItem.balance);
    journalEntryFormArray.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addJournalForm.get("journalEntryList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    //Save Code
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFormArray = <FormArray>(
      this.addJournalForm.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFormArray.controls[rowIndex].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFormArray.controls[rowIndex].get("debit").value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row
    (<FormArray>this.addJournalForm.get("journalEntryList")).removeAt(rowIndex);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
