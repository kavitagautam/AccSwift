import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { RegexConst } from "@app/shared/constants/regex.constant";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";

import { JournalService } from "../../services/journal.service";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { JournalMasterList } from "../../models/journal.model";
@Component({
  selector: "accSwift-list-journal",
  templateUrl: "./list-journal.component.html",
  styleUrls: ["./list-journal.component.css"]
})
export class ListJournalComponent implements OnInit {
  journalSearchForm: FormGroup;
  journalList: JournalMasterList[] = [];
  journalListLoading: boolean;
  date: Date = new Date();

  regexConst = RegexConst;

  //kendo Grid
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter

  //Filter Serach Key
  voucherNoSearch = "";
  journalDateToSearch = "";
  journalDateFromSearch = "";
  projectIdSearch = "";
  seriesIdSearch = "";
  voucherNoSearchKey = "";
  journalDateToSerchKey = "";
  journalDateFromSerchKey = "";
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

  searchFilterList: Array<any> = [];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public journalService: JournalService
  ) {}
  ngOnInit() {
    this.journalSearchForm = this._fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: [""],
      Date: ["", [Validators.pattern(this.regexConst.DATE)]],
      fromDate: ["", [Validators.pattern(this.regexConst.DATE)]]
    });
    this.getJournalList();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
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

    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList
    };

    this.journalService.getJournalList(obj).subscribe(
      response => {
        this.journalList = response.Entity.Entity;
        this.gridView = {
          data: this.journalList,
          total: response.Entity.TotalItemsAvailable
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
    // this.voucherNoSearch = this.journalSearchForm.controls.voucherNo.value;
    // this.journalDateToSearch = this.journalSearchForm.controls.toDate.value;
    // this.journalDateFromSearch = this.journalSearchForm.controls.fromDate.value;
    // this.projectIdSearch = this.journalSearchForm.controls.projectId.value;
    // this.seriesIdSearch = this.journalSearchForm.controls.seriesId.value;

    this.searchFilterList = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.journalSearchForm.invalid) return;
    for (const key in this.journalSearchForm.value) {
      if (this.journalSearchForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.journalSearchForm.value[key]
        });
      }
    }
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

  openConfirmationDialogue(dataItem): void {
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
