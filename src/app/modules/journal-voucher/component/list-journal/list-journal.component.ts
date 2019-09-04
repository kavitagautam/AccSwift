import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TableData } from '../journal-form/table-data';
import { JournalService } from '../../services/journal.service';
import { JournalMaster } from '../../models/journal.model';
import { CustomResponse } from '@app/shared/models/custom-response.model';
@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.css']
})
export class ListJournalComponent implements OnInit {
  journalSearchForm: FormGroup;
  journalList: JournalMaster;

  journalDate: Date = new Date();
  itemsPerPage: number = 10;
  currentPage: number = 1;
  constructor(public _fb: FormBuilder,
    private router: Router, private _serviceJournal: JournalService) {
  }
  SeriesList = [{ 'id': 1, 'name': 'Test' }, { 'id': 2, 'name': 'UnTest' }, { 'id': 3, 'name': 'Experience' }];

  ngOnInit() {
    this.getJournalList();
    this.journalSearchForm = this._fb.group({
      series: [''],
      project: [''],
      voucherNo: [''],
      journalDate: ['']
    });
  }

  getJournalList() {
    this._serviceJournal.getMasterJournal().subscribe(
      (response) => {
        console.log(response);
        this.journalList = response;
      },
      error => {
        console.log(error);
      },
    );
  }

  onSubmit() {
    if (this.journalSearchForm.valid) {
      console.log('form submitted');
      console.log("Form Values" + this.journalSearchForm.value);
    } else {
      console.log("error Occured ");
    }
  }

  setCurrentPage(pageNumber): void {
    this.currentPage = pageNumber;
  }

  public editJournal() {
    this.router.navigate(['/journal/edit']);
  }
}
