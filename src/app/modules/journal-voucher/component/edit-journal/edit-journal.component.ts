import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../services/journal.service';
import { DatePipe, formatDate } from "@angular/common";

@Component({
  selector: 'app-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.css'],
  providers: [DatePipe]

})
export class EditJournalComponent implements OnInit {
  @ViewChild('ledgerSelectModal') ledgerSelectModal: ElementRef;

  editJournalForm: FormGroup;
  submitted: boolean;
  journalDetail;
  projectLists;
  seriesList;
  selectedLedgerRow: number;
  ledgerList = [];


  journalDate: Date = new Date();
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;
  itemsPerPage: number = 10;
  currentPage: number = 1;

  // filtering
  isCollapsed: boolean = false;
  searchByLedgerName: string;
  searchByLedgerCode: string;
  searchByLedgerType: string;

  constructor(public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private route: ActivatedRoute,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.buildJournalForm();
    this.journalService.init();
    this.route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.journalService.getJournalDetails(params.get('id')).subscribe(c => {
          this.journalDetail = c;
          this.buildJournalForm();
          this.setJournalList();
        })
      }
    });
    this.journalService.getLedgerList().subscribe(c => {
      this.ledgerList = c;
    });

  }

  buildJournalForm() {
    this.editJournalForm = this._fb.group({
      seriesID: [this.journalDetail ? this.journalDetail.SeriesID : ""],
      seriesName: [this.journalDetail ? this.journalDetail.SeriesName : ""],
      voucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      journalDate: [this.journalDetail ? formatDate(this.journalDetail.JournalDate, 'yyyy-MM-dd', 'en-US') : ""],
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
      balance: [{ value: '', disabled: true }],
      remarks: [""]
    });
  }

  setJournalList() {
    this.editJournalForm.setControl(
      "journalEntryList",
      this.setJournalFormArray(this.journalDetail.Journaldetails));
  }

  get getjournalEntryList() {
    return <FormArray>this.editJournalForm.get("journalEntryList");
  }

  // this block of code is used to show form array data in the template.....
  setJournalFormArray(journaldetails) {
    const journalFormArray = new FormArray([]);
    if (journaldetails.length > 0) {
      journaldetails.forEach(element => {
        journalFormArray.push(
          this._fb.group({
            particularsOraccountingHead: element.LedgerName,
            ledgerID: element.JournalID,
            debit: [{ value: element.DebitCredit === "Debit" ? element.Amount : '', disabled: element.DebitCredit === "Credit" ? true : false }],
            credit: [{ value: element.DebitCredit === "Credit" ? element.Amount : '', disabled: element.DebitCredit === "Debit" ? true : false }],
            balance: [{ value: element.Amount, disabled: true }],
            remarks: element.Remarks
          })
        );
        if (element.DebitCredit = "Debit") {
          this.debitTotal = + parseInt(element.Amount) || 0;
        }
        if (element.DebitCredit = "Credit") {
          this.creditTotal = + parseInt(element.Amount) || 0;
        }
      });
    } else {
      journalFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          ledgerID: [""],
          debit: ["", Validators.required],
          credit: [""],
          balance: [{ value: '', disabled: true }],
          remarks: [""]
        })
      );
    }
    return journalFormArray;
  }

  checkDebitValue(event: Event, i) {
    var debitValue = 0;
    const control = <FormArray>this.editJournalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('debit').value;
    if (parseFloat(updatedValue)) {
      control.controls[i].get('credit').disable();
    } else {
      control.controls[i].get('credit').enable();
    }
    for (var j = 0; j < control.controls.length; j++) {
      debitValue = debitValue + (parseFloat(control.controls[j].get('debit').value) || 0);
    }
    this.debitTotal = debitValue;
  }

  checkCreditValue(event: Event, i) {
    var creditValue = 0;
    const control = <FormArray>this.editJournalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('credit').value;
    if (parseFloat(updatedValue)) {
      control.controls[i].get('debit').disable();
    } else {
      control.controls[i].get('debit').enable();
    }
    for (var j = 0; j < control.controls.length; j++) {
      creditValue = creditValue + (parseFloat(control.controls[j].get('credit').value) || 0);
    }
    this.creditTotal = creditValue;
  }

  addJournalEntry() {
    this.submitted = true;
    if (this.editJournalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.editJournalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(i: number) {
    // Calculation on Debit Total and Credit Total on Rows Removed 
    const control = <FormArray>this.editJournalForm.get("journalEntryList");
    const deletedCreditValue = control.controls[i].get('credit').value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue = control.controls[i].get('debit').value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row 
    (<FormArray>this.editJournalForm.get("journalEntryList")).removeAt(i);
  }

  public save() {
    if (this.editJournalForm.valid) {
      this.router.navigate(['/journal']);
    } else {
      console.log("error Occured ");
    }
  }

  public cancel() {
    this.editJournalForm.reset();
    this.router.navigate(['/journal']);
  }

  //ledger Select modal 
  setCurrentPage(pageNumber): void {
    this.currentPage = pageNumber;
  }

  openModal(i) {
    this.selectedLedgerRow = i;
  }

  selectedLedger(item, selectedRow) {
    const control = <FormArray>this.editJournalForm.get("journalEntryList");
    control.controls[selectedRow].get('balance').setValue(item.ActualBalance);
    control.controls[selectedRow].get('particularsOraccountingHead').setValue(item.LedgerName);
    control.controls[selectedRow].get('ledgerID').setValue(item.LedgerID);
    this.ledgerSelectModal.nativeElement.click();
  }
}
