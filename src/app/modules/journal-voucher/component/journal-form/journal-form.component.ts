import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { TableData } from './table-data'
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
  adminList = TableData;
  journalDate: Date = new Date();
  itemsPerPage: number = 10;
  currentPage: number = 1;
  debitTotal: number= 0;
  creditTotal: number= 0;
  differenceTotal: number=0;

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
      journalListArray: this._fb.array([this.addListFormGroup()])
    });
  }

  get journalListArrayData() {
    return <FormArray>this.journalForm.get("journalListArray");
  }

  checkValueDebit(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalListArray");
    const updatedValue = control.controls[i].get('debit').value;
    control.controls[i].get('credit').disable();
    control.controls[i].get('balance').setValue(updatedValue);
    this.debitTotal = this.debitTotal + parseInt(updatedValue);
  }

  checkValueCredit(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalListArray");
    const updatedValue = control.controls[i].get('credit').value;
    control.controls[i].get('debit').disable();
    control.controls[i].get('balance').setValue(updatedValue);
    this.creditTotal =this.creditTotal + parseInt(updatedValue);
  }

  addListFormGroup(): FormGroup {
    return this._fb.group({
      particularsORaccountingHead: ["", Validators.required],
      debit: ["", Validators.required],
      credit: [""],
      balance: [""],
      remarks: [""]
    });
  }
  onSubmit() {
    if (this.journalForm.valid) {
      console.log('form submitted');
      console.log("Form Values" + this.journalForm.value);
    } else {
      console.log("error Occured ");
    }
  }

  setCurrentPage(pageNumber): void {
    this.currentPage = pageNumber;
  }

  addNewEntry() {
    this.submitted = true;
    if (this.journalForm.get("journalListArray").invalid) return;

    (<FormArray>this.journalForm.get("journalListArray")).push(
      this.addListFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalRow(i: number) {
    (<FormArray>this.journalForm.get("journalListArray")).removeAt(i);
  }

  public editJournal() {
    this.router.navigate(['/journal/edit']);
  }

  public save() {
    this.router.navigate(['/journal']);
  }

  public cancel() {
    this.router.navigate(['/journal']);
  }
}
