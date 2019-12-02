import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe, formatDate } from "@angular/common";
import { LedgerCodeMatchService } from "../../services/ledger-code-match.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "app-add-journal",
  templateUrl: "./add-journal.component.html",
  styleUrls: ["./add-journal.component.scss"],
  providers: [DatePipe]
})
export class AddJournalComponent implements OnInit {
  private editedRowIndex: number;
  //Input Field Property
  public decimals: number = 2;
  numericFormat: string = "n3";

  addJournalForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();

  debitTotal: number = 0;
  creditTotal: number = 0;
  selectedLedgerRow: number;
  differenceTotal: number = 0;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private modalService: BsModalService,

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
      date: [formatDate(new Date(), "yyyy-MM-dd", "en-US")],
      projectName: [""],
      narration: [""],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()])
    });
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

  changeLedgerValue(dataItem, selectedRow): void {
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
          journalEntryFormArray.controls[selectedRow].get("balance").disable();
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

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const journalEntryFormArray = <FormArray>(
          this.addJournalForm.get("journalEntryList")
        );
        journalEntryFormArray.controls[index]
          .get("balance")
          .setValue(data.ActualBalance);
        journalEntryFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
        journalEntryFormArray.controls[index]
          .get("ledgerID")
          .setValue(data.LedgerID);
        journalEntryFormArray.controls[index]
          .get("ledgerCode")
          .setValue(data.LedgerCode);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
      //Do after Close the Modal
    });
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
