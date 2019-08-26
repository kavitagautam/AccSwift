import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { TableData } from './table-data'

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss']
})
export class JournalFormComponent implements OnInit {
  journalForm: FormGroup;
  viewMode = 'tab1';
  adminList = TableData;

  itemsPerPage: number = 10;
  currentPage: number = 1;


  constructor(public _fb: FormBuilder) {
  }
  SeriesList = [{ 'id': 1, 'name': 'Test' }, { 'id': 2, 'name': 'UnTest' }, { 'id': 3, 'name': 'Experience' }];

  ngOnInit() {
    this.journalForm = this._fb.group({
      series: [''],
      voucherNo: [''],
      journalDate: [''],
      narration: [''],
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



}
