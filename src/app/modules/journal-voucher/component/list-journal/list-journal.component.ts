import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
  journalList : JournalMaster[]= [];

  journalDate: Date = new Date();
  itemsPerPage: number = 10;
  currentPage: number = 1;
  constructor(public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService) {
  }
  ngOnInit() {
    this.getJournalList();
    this.journalService.init();

    this.journalSearchForm = this._fb.group({
      series: [''],
      project: [''],
      voucherNo: [''],
      journalDate: ['']
    });
  }

  getJournalList() {
    this.journalService.getMasterJournal().subscribe(
      (response: JournalMaster[]) => {
        this.journalList = response;
      },
      error => {
        console.log(error);
      },
    );
  }

  onSubmit() {
    if (this.journalSearchForm.valid) {
    } else {
    }
  }

  setCurrentPage(pageNumber): void {
    this.currentPage = pageNumber;
  }

  public editJournal(item) {
    this.router.navigate(['/journal/edit', item.ID]);
  }
}
