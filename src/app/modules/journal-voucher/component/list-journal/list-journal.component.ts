import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";

import { JournalService } from "../../services/journal.service";
import { JournalMaster, ColumnSetting } from "../../models/journal.model";
@Component({
  selector: "app-list-journal",
  templateUrl: "./list-journal.component.html",
  styleUrls: ["./list-journal.component.css"]
})
export class ListJournalComponent implements OnInit {
  journalSearchForm: FormGroup;
  journalList: JournalMaster[] = [];
  journalListLoading: boolean;
  journalDate: Date = new Date();
  itemsPerPage: number = 10;
  currentPage: number = 1;

  //kendo Grid
  public gridView: GridDataResult;

  public pageSize = 10;
  public skip = 0;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService
  ) {}
  ngOnInit() {
    this.getJournalList();
    this.journalService.init();

    this.journalSearchForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      journalDate: [""]
    });

    this.loadItems();
  }

  loadItems(): void {
    this.gridView = {
      data: this.journalList.slice(this.skip, this.skip + this.pageSize),
      total: this.journalList.length
    };
  }
  // Date string parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  getJournalList(): void {
    this.journalListLoading = true;
    this.journalService.getMasterJournal().subscribe(
      res => {
        //mapping the data to change string date format to Date
        const sampleData = res.map(
          dataItem =>
            <JournalMaster>{
              ID: dataItem.ID,
              VoucherNo: dataItem.VoucherNo,
              JournalDate: this.parseAdjust(dataItem.JournalDate),
              SeriesID: dataItem.SeriesID,
              SeriesName: dataItem.SeriesName,
              ProjectID: dataItem.ProjectID,
              ProjectName: dataItem.ProjectName,
              Field1: dataItem.Field1,
              Field2: dataItem.Field2,
              Field3: dataItem.Field3,
              Field4: dataItem.Field4,
              Field5: dataItem.Field5,
              Journaldetails: dataItem.Journaldetails,
              Remarks: dataItem.Remarks,
              CreatedBy: dataItem.CreatedBy,
              CreatedDate: this.parseAdjust(dataItem.CreatedDate),
              ModifiedBy: dataItem.ModifiedBy,
              ModifiedDate: this.parseAdjust(dataItem.ModifiedDate)
            }
        );
        this.journalList = sampleData;
      },
      error => {
        this.journalListLoading = false;
      },
      () => {
        this.journalListLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.journalSearchForm.valid) {
    } else {
    }
  }

  setCurrentPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  public editJournal(item): void {
    this.router.navigate(["/journal/edit", item.ID]);
  }
}
