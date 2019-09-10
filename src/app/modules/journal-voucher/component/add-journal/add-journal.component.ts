import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../services/journal.service';
import { DatePipe, formatDate } from "@angular/common";

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.scss'],
  providers: [DatePipe]
})
export class AddJournalComponent implements OnInit {
  @ViewChild('ledgerSelectModal') ledgerSelectModal: ElementRef;

  name: string;
  addJournalForm: FormGroup;
  submitted: boolean;
  journalDetail;
  ledgerList = [];
  journalDate: Date = new Date();

  itemsPerPage: number = 10;
  currentPage: number = 1;
  debitTotal: number = 0;
  creditTotal: number = 0;
  selectedLedgerRow: number;
  differenceTotal: number = 0;

  // filtering
  isCollapsed: boolean = false;
  searchByLedgerName: string;
  searchByLedgerCode: string;
  searchByLedgerType: string;

  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
  ) { }

  ngOnInit() {
    this.journalService.init();
    this.buildAddJournalForm();
  }

  buildAddJournalForm() {
    this.addJournalForm = this._fb.group({
      seriesID: [""],
      seriesName:[""],
      voucherNo: [""],
      journalDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en-US')],
      projectName: [""],
      narration: [""],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()])
    });

    this.journalService.getLedgerList().subscribe(c => {
      this.ledgerList = c;
    });

  }

  get getjournalEntryList() {
    return <FormArray>this.addJournalForm.get("journalEntryList");
  }

  checkDebitValue(event: Event, i) {
    var debitValue = 0
    const control = <FormArray>this.addJournalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('debit').value;
    if (parseFloat(updatedValue)) {
      control.controls[i].get('credit').disable();
    } else {
      control.controls[i].get('credit').enable();
    }
    // calculate the total debit
    for (var j = 0; j < control.controls.length; j++) {
      debitValue = debitValue + (parseFloat(control.controls[j].get('debit').value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, i) {
    var creditValue = 0
    const control = <FormArray>this.addJournalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('credit').value;
    if (parseFloat(updatedValue)) {
      control.controls[i].get('debit').disable();
    } else {
      control.controls[i].get('debit').enable();
    }
    for (var j = 0; j < control.controls.length; j++) {
      creditValue = creditValue + (parseFloat(control.controls[j].get('credit').value) || 0);
    }
    this.creditTotal = creditValue;
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      particularsOraccountingHead: ["", Validators.required],
      ledgerID: [""],
      debit: ["", Validators.required],
      credit: [""],
      balance: [{ value: '', disabled: true }],
      remarks: [""]
    });
  }

  addJournalEntry() {
    this.submitted = true;
    if (this.addJournalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.addJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(i: number) {
    // Calculation on Debit Total and Credit Total on Rows Removed 
    const control = <FormArray>this.addJournalForm.get("journalEntryList");
    const deletedCreditValue = control.controls[i].get('credit').value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue = control.controls[i].get('debit').value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row 
    (<FormArray>this.addJournalForm.get("journalEntryList")).removeAt(i);
  }

  public save() {
    if (this.addJournalForm.valid) {
      this.router.navigate(['/journal']);
    } else {
      console.log("error Occured ");
    }
  }

  public cancel() {
    this.addJournalForm.reset();
    this.router.navigate(['/journal']);
  }

  //ledger Select modal 
  setCurrentPage(pageNumber): void {
    this.currentPage = pageNumber;
  }

  selectedLedger(item, selectedRow) {
    const control = <FormArray>this.addJournalForm.get("journalEntryList");
    control.controls[selectedRow].get('balance').setValue(item.ActualBalance);
    control.controls[selectedRow].get('particularsOraccountingHead').setValue(item.LedgerName);
    control.controls[selectedRow].get('ledgerID').setValue(item.LedgerID);
    this.ledgerSelectModal.nativeElement.click();
  }

  openModal(i) {
    this.selectedLedgerRow = i;
  }

}
