import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../services/journal.service';
import { DatePipe, formatDate } from "@angular/common";


@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss'],
  providers: [DatePipe]
})
export class JournalFormComponent implements OnInit {
  journalForm: FormGroup;
  submitted: boolean;
  journalDetail;
  journalDate: Date = new Date();
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;

  constructor(public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {
  }
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

  }

  buildJournalForm() {
    this.journalForm = this._fb.group({
      seriesID: [this.journalDetail ? this.journalDetail.SeriesID : ""],
      voucherNo: [this.journalDetail ? this.journalDetail.Voucher_No : ""],
      journalDate: [this.journalDetail ? formatDate(this.journalDetail.Journal_Date, 'yyyy-MM-dd', 'en-US') : ""],
      project: [this.journalDetail ? this.journalDetail.ProjectID : ""],
      narration: [""],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()])
    });
  }

  setJournalList() {
    this.journalForm.setControl(
      "journalEntryList",
      this.setJournalFormArray(this.journalDetail.tblJournalDetails));
  }

  get getjournalEntryList() {
    return <FormArray>this.journalForm.get("journalEntryList");
  }

  // this block of code is used to show form array data in the template.....
  setJournalFormArray(tblJournalDetails) {
    const journalFormArray = new FormArray([]);
    if (tblJournalDetails) {
      tblJournalDetails.forEach(element => {
        journalFormArray.push(
          this._fb.group({
            particularsOraccountingHead: element.Journal_DetailID,
            debit: [{ value: element.DrCr === "Debit" ? element.Amount : '', disabled: element.DrCr === "Credit" ? true : false }],
            credit: [{ value: element.DrCr === "Credit" ? element.Amount : '', disabled: element.DrCr === "Debit" ? true : false }],
            balance: element.Amount,
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
      journalFormArray.push(this.addJournalEntryFormGroup())
    }
    return journalFormArray;
  }

  checkDebitValue(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('debit').value;
    if (parseInt(updatedValue)) {
      control.controls[i].get('credit').disable();
    } else {
      control.controls[i].get('credit').enable();
    }
    control.controls[i].get('balance').setValue(updatedValue);
    this.debitTotal = this.debitTotal + parseInt(updatedValue) || 0;
  }

  checkCreditValue(event: Event, i) {
    const control = <FormArray>this.journalForm.get("journalEntryList");
    const updatedValue = control.controls[i].get('credit').value;
    if (parseInt(updatedValue)) {
      control.controls[i].get('debit').disable();
    } else {
      control.controls[i].get('debit').enable();
    }
    control.controls[i].get('balance').setValue(updatedValue);
    this.creditTotal = this.creditTotal + parseInt(updatedValue) || 0;
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      particularsOraccountingHead: ["", Validators.required],
      debit: ["", Validators.required],
      credit: [""],
      balance: [{ value: '', disabled: true }],
      remarks: [""]
    });
  }

  addJournalEntry() {
    this.submitted = true;
    if (this.journalForm.get("journalEntryList").invalid) return;

    (<FormArray>this.journalForm.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(i: number) {
    // Calculation on Debit Total and Credit Total on Rows Removed 
    const control = <FormArray>this.journalForm.get("journalEntryList");
    const deletedCreditValue = control.controls[i].get('credit').value || 0;
    if (parseInt(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseInt(deletedCreditValue) || 0;
    }
    const deletedDebitValue = control.controls[i].get('debit').value || 0;
    if (parseInt(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseInt(deletedDebitValue) || 0;
    }
    // Remove the Row 
    (<FormArray>this.journalForm.get("journalEntryList")).removeAt(i);
  }

  public editJournal() {
    this.router.navigate(['/journal/edit']);
  }

  public save() {
    if (this.journalForm.valid) {
      this.router.navigate(['/journal']);
    } else {
      console.log("error Occured ");
    }
  }

  public cancel() {
    this.journalForm.reset();
    this.router.navigate(['/journal']);
  }

}
