import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  process,
  State,
  SortDescriptor,
  orderBy,
  CompositeFilterDescriptor,
  filterBy
} from "@progress/kendo-data-query";

import { JournalService } from "../../services/journal.service";
import { JournalMaster } from "../../models/journal.model";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
@Component({
  selector: "app-list-journal",
  templateUrl: "./list-journal.component.html",
  styleUrls: ["./list-journal.component.css"]
})
export class ListJournalComponent implements OnInit {
  journalSearchForm: FormGroup;
  journalList: JournalMaster[] = [];
  journalListLoading: boolean;
  date: Date = new Date();
  //kendo Grid
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter

  //Filter Serach Key
  voucherNoSearch = "";
  journalDateSearch = "";
  projectIdSearch = "";
  seriesIdSearch = "";
  voucherNoSearchKey = "";
  journalDateSerchKey = "";
  projectNameSerachKey = "";
  seriesNameSearchKey = "";
  remarkSearchKey = "";
  orderByKey = "";
  dirKey = "asc";
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];
  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public journalService: JournalService
  ) {}
  ngOnInit() {
    this.journalSearchForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      date: [""]
    });
    this.getJournalList();
    this.journalService.init();
  }

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  // Date string parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey=""
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    if (this.sort[0].field === "VoucherNo") {
      this.orderByKey = "Voucher_No";
    }
    if (this.sort[0].field === "Date") {
      this.orderByKey = "Journal_Date";
    }
    if (this.sort[0].field === "ProjectName") {
      this.orderByKey = "Project";
    }
    if (this.sort[0].field === "SeriesName") {
      this.orderByKey = "Series";
    }
    if (this.sort[0].field === "Remarks") {
      this.orderByKey = "Remarks";
    }
    this.getJournalList();
  }

  getJournalList(): void {
    this.journalListLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey, // string[] OrderByList = new string[] { "Voucher_No", "Journal_Date", "Remarks", "Series", "Project" };
      Direction: this.dirKey, // "asc" or "desc"
      SeriesId: this.seriesIdSearch,
      ProjectId: this.projectIdSearch,
      VoucherNo: this.voucherNoSearch,
      JournalDate: this.journalDateSearch,
      VoucherNoSearchTerm: this.voucherNoSearchKey,
      ProjectNameSearchTerm: this.projectNameSerachKey,
      SeriesNameSearchTerm: this.seriesNameSearchKey,
      Remarks: this.remarkSearchKey
    };
    this.journalService.getJournalList(params).subscribe(
      res => {
        //mapping the data to change string date format to Date
        const sampleData = res.Entity.map(
          dataItem =>
            <JournalMaster>{
              ID: dataItem.ID,
              VoucherNo: dataItem.VoucherNo,
              Date: this.parseAdjust(dataItem.JournalDate),
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
        this.gridView = {
          data: this.journalList,
          total: res.TotalItemsAvailable
        };
      },
      error => {
        this.journalListLoading = false;
      },
      () => {
        this.journalListLoading = false;
      }
    );
  }

  public filterChange(filter): void {
    this.voucherNoSearchKey = "";
    this.projectNameSerachKey = "";
    this.seriesNameSearchKey = "";
    this.filter = filter;
    for (let i = 0; i < filter.filters.length; i++) {
      if (filter.filters[i].field == "VoucherNo") {
        this.voucherNoSearchKey = filter.filters[i].value;
      }
      if (filter.filters[i].field == "ProjectName") {
        this.projectNameSerachKey = filter.filters[i].value;
      }
      if (filter.filters[i].field == "SeriesName") {
        this.seriesNameSearchKey = filter.filters[i].value;
      }
    }
    this.getJournalList();
  }

  public searchForm() {
    this.voucherNoSearch = this.journalSearchForm.controls.voucherNo.value;
    this.journalDateSearch = this.journalSearchForm.controls.journalDate.value;
    this.projectIdSearch = this.journalSearchForm.controls.project.value;
    this.seriesIdSearch = this.journalSearchForm.controls.series.value;
    this.getJournalList();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;

    if (event.skip == 0) {
      this.skip = event.skip;
      this.currentPage = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.currentPage = pageNo;
    }
    this.getJournalList();
  }

  public editJournal(item): void {
    this.router.navigate(["/journal/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const journalId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Voucher No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteJournalByID(journalId.id);
      }
    });
  }

  public deleteJournalByID(id): void {
    this.journalService.deleteJournal(id).subscribe(response => {
      this.toastr.success("Journal deleted successfully");
      this.getJournalList();
    });
  }
}
