import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TableData } from '../journal-form/table-data';
import { JournalService } from '../../services/journal.service';
@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.css']
})
export class ListJournalComponent implements OnInit {
  journalForm: FormGroup;
  adminList = TableData;
  journalDate : Date = new Date();

  itemsPerPage: number = 10;
  currentPage: number = 1;


  constructor(public _fb: FormBuilder,
    private router: Router,private _serviceJournal: JournalService) {
  }
  SeriesList = [{ 'id': 1, 'name': 'Test' }, { 'id': 2, 'name': 'UnTest' }, { 'id': 3, 'name': 'Experience' }];

  ngOnInit() {
    console.log(JSON.stringify(this._serviceJournal.getMasterJournal()));
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


  public editJournal(){

    this.router.navigate(['/journal/edit']);
  }


}
