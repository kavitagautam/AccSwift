import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { PreferenceService } from "../../../preference/services/preference.service";
import { Preferences } from "../../../preference/models/preference.model";
import { IconConst } from "@app/shared/constants/icon.constant";
import { SettingsService } from '@accSwift-modules/settings/services/settings.service';
import { Settings } from '@accSwift-modules/settings/models/settings.model';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { DatePipe } from "@angular/common";
var adbs = require("ad-bs-converter");

@Component({
  selector: "accSwift-add-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./add-journal.component.scss"],
  providers: [DatePipe]
})
export class AddJournalComponent implements OnInit {
  private editedRowIndex: number;
  settings: Settings;
  public selectedDate:string =''
  // datePick = this.settingsService.settings ? this.settingsService.settings.DEFAULT_DATE.Value:'';
  //Input Field Property
  iconConst = IconConst;

  public decimals: number = 2;
  numericFormat: string = "n3";
  preferenceData: Preferences;
  journalVoucherForms: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();

  debitTotal: number = 0;
  creditTotal: number = 0;
  selectedLedgerRow: number;
  differenceTotal: number = 0;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-lg",
  };
  todaysDateInEnglish: any;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService,
    private preferenceService: PreferenceService,
    private settingsService: SettingsService,
    private localStorageService: LocalStorageService,
    private dateConverter: DateConverterService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.buildJournalVoucherForms();
   this.selectedDate= this.localStorageService.getLocalStorageItem(
      "SelectedDate");
  }

  buildJournalVoucherForms(): void {
    this.journalVoucherForms = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_JRNL.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
        Validators.required,
      ],
      VoucherNo: ["", [Validators.required]],
      Date: [new Date()],
      Remarks: [""],
      Journaldetails: this._fb.array([this.addJournalEntryFormGroup()]),
    });
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      TransactionSubLedger: this._fb.array([this.addSubLedgerFormGroup()]),
      LedgerCode: [""],
      LedgerName: ["", Validators.required],
      LedgerID: [""],
      DrAmount: [""],
      CrAmount: [""],
      LedgerBalance: [""],
      Remarks: [""],
    });
  }

  addSubLedgerFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      SubLedgerID: [null],
      Name: [""],
      Amount: [0],
      DrCr: [""],
      Remarks: [""],
    });
  }

  get getjournalEntryList(): FormArray {
    return <FormArray>this.journalVoucherForms.get("Journaldetails");
  }

  //This ledger code input has not been used
  changeLedgerValue(dataItem, selectedRow): void {
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("Journaldetails")
    );

    const ledgerCode = journalEntryFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      journalEntryFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          journalEntryFormArray.controls[selectedRow]
            .get("balance")
            .setValue(selectedItem[0].ActualBalance);
          journalEntryFormArray.controls[selectedRow].get("balance").disable();
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

  public save(): void {
    // if (this.journalVoucherForms.invalid) return;
    this.journalService
      .addJournalVoucher(this.journalVoucherForms.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/journal"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Journal added successfully");
        }
      );
  }

  public cancel(): void {
    this.journalVoucherForms.reset();
    this.router.navigate(["/journal"]);
  }

  getChangedDate(value)
  {
    // this.todaysDateInEnglish=new Date();
    // value = this.datePipe.transform(this.todaysDateInEnglish, "YYYY-MM-DD");
    // this.adToBsInStrng(value);
    // this.journalVoucherForms
    //     .get("Date")
    //     .patchValue(value);
    // console.log(value);


    // let date = this.dateConverter.adToBsInObject(
    //   this.journalVoucherForms.value.Date
    // );
    // let dateInEnglish = this.adToBsInStrng(date);
    // this.journalVoucherForms.get("Date").patchValue(dateInEnglish);
    // this.journalVoucherForms.value.Date = this.datePipe.transform(
    //   this.journalVoucherForms.value.Date,
    //   "yyyy-MM-dd"
    // );
    // console.log(dateInEnglish);

    value = this.datePipe.transform(value, "yyyy/MM/dd");
    console.log(value);
    let dateObject = adbs.ad2bs(value);
    console.log(dateObject)
    this.journalVoucherForms.get("Date").patchValue(dateObject);
    let resultDate =  `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
    console.log(resultDate);
    return resultDate;
  }

  bsToAdInStrng(dateInBs)
  {
    console.log(dateInBs);
    return this.dateConverter.bsToAdInString(dateInBs);
  }

  adToBsInStrng(dateInAd)
  {
    console.log(dateInAd);
    return this.dateConverter.adToBsDateInString(dateInAd);
  }
}
