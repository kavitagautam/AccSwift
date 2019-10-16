import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe, formatDate } from "@angular/common";
import { LedgerList, JournalMaster } from "../../models/journal.model";
import {
  PageChangeEvent,
  SelectAllCheckboxState
} from "@progress/kendo-angular-grid";
import { SortDescriptor } from "@progress/kendo-data-query";
import { LedgerCodeMatchService } from "../../services/ledger-code-match.service";

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

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private route: ActivatedRoute,
    public ledgerCodeMatchService: LedgerCodeMatchService,
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
    this.getLedgerList();
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
      ledgerCode: ["", null, this.ledgerCodeMatchService.ledgerCodeMatch()],
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
            ledgerCode: [element.Ledger.Code ? element.Ledger.Code : ""],
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
          ledgerCode: ["", null, this.ledgerCodeMatchService.ledgerCodeMatch()],
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
    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFormArray.controls[index].get("debit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFormArray.controls[index].get("credit").disable();
    } else {
      journalEntryFormArray.controls[index].get("credit").enable();
    }
    for (let j = 0; j < journalEntryFormArray.controls.length; j++) {
      debitValue =
        debitValue +
        (parseFloat(journalEntryFormArray.controls[j].get("debit").value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, index: number): void {
    let creditValue = 0;
    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const updatedValue = journalEntryFormArray.controls[index].get("credit")
      .value;
    if (parseFloat(updatedValue)) {
      journalEntryFormArray.controls[index].get("debit").disable();
    } else {
      journalEntryFormArray.controls[index].get("debit").enable();
    }
    for (let j = 0; j < journalEntryFormArray.controls.length; j++) {
      creditValue =
        creditValue +
        (parseFloat(journalEntryFormArray.controls[j].get("credit").value) ||
          0);
    }
    this.creditTotal = creditValue;
  }

  changeLedgerValue(dataItem, selectedRow) {
    if (this.ledgerList && this.ledgerList.length > 0) {
      const journalEntryFormArray = <FormArray>(
        this.editJournalForm.get("journalEntryList")
      );

      const ledgerCode = journalEntryFormArray.controls[selectedRow].get(
        "ledgerCode"
      ).value;
      if (
        journalEntryFormArray.controls[selectedRow].get("ledgerCode").status ===
        "VALID"
      ) {
        this.journalService.checkLedgerCode(ledgerCode).subscribe(res => {
          const selectedItem = res.Entity;
          if (selectedItem && selectedItem.length > 0) {
            journalEntryFormArray.controls[selectedRow]
              .get("balance")
              .setValue(selectedItem[0].ActualBalance);
            journalEntryFormArray.controls[selectedRow]
              .get("balance")
              .disable();
            journalEntryFormArray.controls[selectedRow]
              .get("particularsOraccountingHead")
              .setValue(selectedItem[0].LedgerName);
            journalEntryFormArray.controls[selectedRow]
              .get("ledgerID")
              .setValue(selectedItem[0].LedgerID);
          }
        });
      }
    }
  }

  addJournalEntry(): void {
    this.submitted = true;
    if (this.editJournalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.editJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
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

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  openModal(index: number): void {
    this.mySelection = [];
    this.selectedLedgerRow = index;
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

  //Selected the Ledger row
  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.ledgerList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    const selected = this.ledgerList.filter(function(obj) {
      return obj.LedgerID == e[0];
    });

    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[selectedRow]
      .get("balance")
      .setValue(selected[0].ActualBalance);
    journalEntryFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(selected[0].LedgerName);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerID")
      .setValue(selected[0].LedgerID);
    this.ledgerSelectModal.nativeElement.click();
  }

  // select ledger column
  selectedLedger(item, selectedRow): void {
    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[selectedRow]
      .get("balance")
      .setValue(item.ActualBalance);
    journalEntryFormArray.controls[selectedRow].get("balance").disable();
    journalEntryFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(item.LedgerName);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerID")
      .setValue(item.LedgerID);
    journalEntryFormArray.controls[selectedRow]
      .get("ledgerCode")
      .setValue(item.LedgerCode);
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
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    journalEntryFormArray.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    journalEntryFormArray.controls[rowIndex]
      .get("ledgerID")
      .setValue(dataItem.ledgerID);
    journalEntryFormArray.controls[rowIndex]
      .get("debit")
      .setValue(dataItem.debit);
    journalEntryFormArray.controls[rowIndex]
      .get("credit")
      .setValue(dataItem.credit);
    journalEntryFormArray.controls[rowIndex]
      .get("balance")
      .setValue(dataItem.balance);
    journalEntryFormArray.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editJournalForm.get("journalEntryList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    //Save code
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFormArray = <FormArray>(
      this.editJournalForm.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFormArray.controls[rowIndex].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFormArray.controls[rowIndex].get("debit").value || 0;
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
