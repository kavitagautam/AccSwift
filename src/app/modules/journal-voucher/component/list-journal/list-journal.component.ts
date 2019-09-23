import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  process,
  State,
  SortDescriptor,
  orderBy
} from "@progress/kendo-data-query";

import { JournalService } from "../../services/journal.service";
import { JournalMaster } from "../../models/journal.model";
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
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field:
        "VoucherNo" ||
        "JournalDate" ||
        "ProjectName" ||
        "SeriesName" ||
        "Remarks",
      dir: "asc"
    }
  ];
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
  }

  // Date string parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getJournalList();
  }

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
  }

  public editJournal(item): void {
    this.router.navigate(["/journal/edit", item.ID]);
  }
}
