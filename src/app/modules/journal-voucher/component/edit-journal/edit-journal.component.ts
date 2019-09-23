import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe, formatDate } from "@angular/common";
import { LedgerList, JournalMaster } from "../../models/journal.model";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  process,
  State,
  SortDescriptor,
  orderBy
} from "@progress/kendo-data-query";

@Component({
  selector: "app-edit-journal",
  templateUrl: "./edit-journal.component.html",
  styleUrls: ["./edit-journal.component.css"],
  providers: [DatePipe]
})
export class EditJournalComponent implements OnInit {
  @ViewChild("ledgerSelectModal") ledgerSelectModal: ElementRef;

  private editedRowIndex: number;

  editJournalForm: FormGroup;
  journalDetail: JournalMaster;
  ledgerList: LedgerList[] = [];
  selectedLedgerRow: number;
  submitted: boolean;
  ledgerListLoading: boolean;
  rowSubmitted: boolean;

  journalDate: Date = new Date();
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;
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
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
  ];
  // filtering
  isCollapsed: boolean = false;
  searchByLedgerName: string;
  searchByLedgerCode: string;
  searchByLedgerType: string;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.buildJournalForm();
    this.journalService.init();
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.journalService
          .getJournalDetails(params.get("id"))
          .subscribe(res => {
            this.journalDetail = res;
            this.buildJournalForm();
            this.setJournalList();
          });
      }
    });
  }

  buildJournalForm(): void {
    this.editJournalForm = this._fb.group({
      seriesID: [this.journalDetail ? this.journalDetail.SeriesID : ""],
      seriesName: [this.journalDetail ? this.journalDetail.SeriesName : ""],
      voucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      journalDate: [
        this.journalDetail
          ? formatDate(this.journalDetail.JournalDate, "yyyy-MM-dd", "en-US")
          : ""
      ],
      projectName: [this.journalDetail ? this.journalDetail.ProjectName : ""],
      narration: [this.journalDetail ? this.journalDetail.Remarks : ""],
      journalEntryList: [this.addJournalEntryFormGroup()]
    });
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      particularsOraccountingHead: ["", Validators.required],
      ledgerID: [""],
      debit: ["", Validators.required],
      credit: [""],
      balance: [""],
      remarks: [""]
    });
  }

  setJournalList(): void {
    this.editJournalForm.setControl(
      "journalEntryList",
      this.setJournalFormArray(this.journalDetail.Journaldetails)
    );
  }

  get getjournalEntryList(): FormArray {
    return <FormArray>this.editJournalForm.get("journalEntryList");
  }

  // this block of code is used to show form array data in the template.....
  setJournalFormArray(journaldetails): FormArray {
    const journalFormArray = new FormArray([]);
    if (journaldetails && journaldetails.length > 0) {
      journaldetails.forEach(element => {
        journalFormArray.push(
          this._fb.group({
            particularsOraccountingHead: [
              element.LedgerName,
              Validators.required
            ],
            ledgerID: element.JournalID,
            debit: [
              {
                value: element.DebitCredit === "Debit" ? element.Amount : "",
                disabled: element.DebitCredit === "Credit" ? true : false
              }
            ],
            credit: [
              {
                value: element.DebitCredit === "Credit" ? element.Amount : "",
                disabled: element.DebitCredit === "Debit" ? true : false
              }
            ],
            balance: [
              { value: element.Amount ? element.Amount : "", disabled: true }
            ],
            remarks: element.Remarks
          })
        );
        if ((element.DebitCredit = "Debit")) {
          this.debitTotal = +parseInt(element.Amount) || 0;
        }
        if ((element.DebitCredit = "Credit")) {
          this.creditTotal = +parseInt(element.Amount) || 0;
        }
      });
    } else {
      journalFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          ledgerID: [""],
          debit: ["", Validators.required],
          credit: [""],
          balance: [{ value: "", disabled: false }],
          remarks: [""]
        })
      );
    }
    return journalFormArray;
  }

  checkDebitValue(event: Event, index: number): void {
    let debitValue = 0;
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFromArray.controls[index].get("debit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFromArray.controls[index].get("credit").disable();
    } else {
      journalEntryFromArray.controls[index].get("credit").enable();
    }
    for (let j = 0; j < journalEntryFromArray.controls.length; j++) {
      debitValue =
        debitValue +
        (parseFloat(journalEntryFromArray.controls[j].get("debit").value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, index: number): void {
    let creditValue = 0;
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFromArray.controls[index].get("credit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFromArray.controls[index].get("debit").disable();
    } else {
      journalEntryFromArray.controls[index].get("debit").enable();
    }
    for (let j = 0; j < journalEntryFromArray.controls.length; j++) {
      creditValue =
        creditValue +
        (parseFloat(journalEntryFromArray.controls[j].get("credit").value) ||
          0);
    }
    this.creditTotal = creditValue;
  }

  addJournalEntry(): void {
    this.submitted = true;
    if (this.editJournalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.editJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(index: number): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFromArray.controls[index].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFromArray.controls[index].get("debit").value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row
    (<FormArray>this.editJournalForm.get("journalEntryList")).removeAt(index);
  }

  public save(): void {
    if (this.editJournalForm.valid) {
      this.router.navigate(["/journal"]);
    } else {
    }
  }

  public cancel(): void {
    this.editJournalForm.reset();
    this.router.navigate(["/journal"]);
  }

  //ledger Select modal
  setCurrentPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  openModal(index: number): void {
    this.selectedLedgerRow = index;
    this.searchByLedgerName = "";
    this.searchByLedgerCode = "";
    this.searchByLedgerType = "";
    this.getLedgerList();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.journalService.getLedgerList().subscribe(
      res => {
        this.ledgerList = res;
      },
      error => {
        this.ledgerListLoading = false;
      },
      () => {
        this.ledgerListLoading = false;
      }
    );
  }

  selectedLedger(item, selectedRow): void {
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    journalEntryFromArray.controls[selectedRow]
      .get("balance")
      .setValue(item.ActualBalance);
    journalEntryFromArray.controls[selectedRow].get("balance").disable();
    journalEntryFromArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(item.LedgerName);
    journalEntryFromArray.controls[selectedRow]
      .get("ledgerID")
      .setValue(item.LedgerID);
    this.ledgerSelectModal.nativeElement.click();
  }

  // knedo uI
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editJournalForm.get("journalEntryList").invalid) return;
    (<FormArray>this.editJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    // sender.addRow();
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    journalEntryFromArray.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    journalEntryFromArray.controls[rowIndex]
      .get("ledgerID")
      .setValue(dataItem.ledgerID);
    journalEntryFromArray.controls[rowIndex]
      .get("debit")
      .setValue(dataItem.debit);
    journalEntryFromArray.controls[rowIndex]
      .get("credit")
      .setValue(dataItem.credit);
    journalEntryFromArray.controls[rowIndex]
      .get("balance")
      .setValue(dataItem.balance);
    journalEntryFromArray.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editJournalForm.get("journalEntryList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    // this.service.save(product, isNew);
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFromArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFromArray.controls[rowIndex].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFromArray.controls[rowIndex].get("debit").value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row
    (<FormArray>this.editJournalForm.get("journalEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
