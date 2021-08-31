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
import { DateConverterComponent } from "@accSwift-modules/accswift-shared/components/date-converter/date-converter.component";
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
  iconConst = IconConst;

  public decimals: number = 2;
  numericFormat: string = "n3";
  preferenceData: Preferences;
  journalVoucherForms: FormGroup;
  settingsForm: FormGroup;
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
    this.buildSettingsForm();
    this.getSettings();
    // this.selectedDate= this.localStorageService.getLocalStorageItem(
    //   "SelectedDate");
    localStorage.removeItem("SelectedDate");
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_DATE: [this.settings ? this.settings.DEFAULT_DATE.Value : ""]
    });
  }

  getSettings(): void {
    this.settingsService.getSettingsData().subscribe((response) => {
      this.settings = response.Entity;
      console.log(this.settings);
      let pickedDate = this.settings.DEFAULT_DATE.Value;
      console.log(pickedDate);
      this.selectedDate = pickedDate;
      this.buildSettingsForm();
    });
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
    if (this.selectedDate == 'Nepali')
    {
      let dateFormat = this.datePipe.transform(this.journalVoucherForms.value.Date,"yyyy/MM/dd");
      console.log(this.journalVoucherForms.value.Date);
      let var1 = adbs.bs2ad(dateFormat);
      let resultDate = `${var1.year}-${var1.month}-${var1.day}`;
      this.journalVoucherForms.get("Date").patchValue(resultDate);
      console.log(this.journalVoucherForms.value.Date);
    }
    else if (this.selectedDate == 'English')
    {
      console.log(this.journalVoucherForms.value.Date);
      this.journalVoucherForms.get("Date").patchValue(this.journalVoucherForms.value.Date);
    }
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

  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  dateConverterPopup(): void
  {
    this.modalRef = this.modalService.show(DateConverterComponent, {
      initialState: { VoucherForm: this.journalVoucherForms },
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm",
    })
  }

  public cancel(): void {
    this.journalVoucherForms.reset();
    this.router.navigate(["/journal"]);
  }

}
