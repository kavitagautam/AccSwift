import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss']
})
export class JournalFormComponent implements OnInit {
  journalForm: FormGroup;
  submitted: boolean;

  viewMode = 'tab1';
  journalDate: Date = new Date();
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;

  constructor(public _fb: FormBuilder,
    private router: Router) {
  }
  SeriesList = [{ 'id': 1, 'name': 'Test' }, { 'id': 2, 'name': 'UnTest' }, { 'id': 3, 'name': 'Experience' }];

  ngOnInit() {
    this.journalForm = this._fb.group({
      series: [''],
      voucherNo: [''],
      journalDate: [''],
      narration: [''],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()])
    });
  }

  get journalEntryListData() {
    return <FormArray>this.journalForm.get("journalEntryList");
  }

  checkValueDebit(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('debit').value;
    if (parseInt(updatedValue)) {
      control.controls[i].get('credit').disable();
    } else {
      control.controls[i].get('credit').enable();
    }
    control.controls[i].get('balance').setValue(updatedValue);
    this.debitTotal = this.debitTotal + parseInt(updatedValue) || 0;
  }

  checkValueCredit(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('credit').value;
    if (parseInt(updatedValue)) {
      control.controls[i].get('debit').disable();
    } else {
      control.controls[i].get('debit').enable();
    }
    control.controls[i].get('balance').setValue(updatedValue);
    this.creditTotal = this.creditTotal + parseInt(updatedValue) || 0;
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      particularsORaccountingHead: ["", Validators.required],
      debit: ["", Validators.required],
      credit: [""],
      balance: [{ value: '', disabled: true }],
      remarks: [""]
    });
  }

  addNewJournalEntry() {
    this.submitted = true;
    if (this.journalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.journalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(i: number) {
    (<FormArray>this.journalForm.get("journalEntryList")).removeAt(i);
  }

  public editJournal() {
    this.router.navigate(['/journal/edit']);
  }

  public save() {
    if (this.journalForm.valid) {
      console.log('form submitted');
      console.log("Form Values" + this.journalForm.value);
      this.router.navigate(['/journal']);
    } else {
      console.log("error Occured ");
    }
  }

  public cancel() {
    this.journalForm.reset();
    this.router.navigate(['/journal']);
  }

}
