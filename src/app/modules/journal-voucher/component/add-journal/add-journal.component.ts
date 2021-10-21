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
import { RecurringInvoiceComponent } from "@accSwift-modules/accswift-shared/components/recurring-invoice/recurring-invoice.component";
import { NepaliDatePickerSettings } from "@accSwift-modules/accswift-shared/models/nepali-date-settings";
var adbs = require("ad-bs-converter");
var moment = require("moment");

@Component({
  selector: "accSwift-add-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./add-journal.component.scss"],
  providers: [DatePipe]
})
export class AddJournalComponent implements OnInit {
  private editedRowIndex: number;
  listLoading:boolean;
  settings: Settings;
  nepaliDatePickSettings:NepaliDatePickerSettings = {language: "english",
  dateFormat: "YYYY-MM-DD",
  ndpMonth: true,
  ndpYear: true}; 
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
      // console.log(this.settings);
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
      Date: [moment().format('L')],
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

  openRecurringInvoice():void
  {
    this.modalRef = this.modalService.show(RecurringInvoiceComponent, {backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-md",});
  }


  public cancel(): void {
    this.journalVoucherForms.reset();
    this.router.navigate(["/journal"]);
  }


  // saveReoccurance() {
  //   console.log(this.taskForm.value.reg_number, "regNumber");
  //   if (!this.taskForm.valid) {
  //     this.isSubmitted = true;
  //     return;
  //   }
  //   if (this.reoccuranceForm.value.Sunday == true) {
  //     this.week_day.push("Sunday");
  //   }
  //   if (this.reoccuranceForm.value.Monday == true) {
  //     this.week_day.push("Monday");
  //   }
  //   if (this.reoccuranceForm.value.Tuesday == true) {
  //     this.week_day.push("Tuesday");
  //   }
  //   if (this.reoccuranceForm.value.Wednesday == true) {
  //     this.week_day.push("Wednesday");
  //   }
  //   if (this.reoccuranceForm.value.Thursday == true) {
  //     this.week_day.push("Thursday");
  //   }
  //   if (this.reoccuranceForm.value.Friday == true) {
  //     this.week_day.push("Friday");
  //   }
  //   if (this.reoccuranceForm.value.Saturday == true) {
  //     this.week_day.push("Saturday");
  //   }

  //   var unique = this.week_day.filter(function (elem, index, self) {
  //     return index === self.indexOf(elem);
  //   });

  //   let body = {
  //     category: this.taskForm.value.category,
  //     client_id: this.taskForm.value.client_id,
  //     staff_id: this.taskForm.value.staff_id,
  //     appointment_time: this.taskForm.value.appointment_time + ":00",
  //     estimated_time: this.taskForm.value.estimated_time + ":00",
  //     date: this.taskForm.value.date,
  //     actual_in: this.taskForm.value.actual_in,
  //     actual_out: this.taskForm.value.actual_out,
  //     task: this.taskForm.value.task,
  //     vehicle_id: this.taskForm.value.reg_number,
  //     description: this.taskForm.value.description,
  //     reoccurance: this.reoccurance,
  //     opening_mileage: this.taskForm.value.opening_mileage,
  //     closing_mileage: this.taskForm.value.closing_mileage,
  //     start_date: this.reoccuranceForm.value.start_date,
  //     end_date: this.reoccuranceForm.value.end_date,
  //     week_day: unique.toString(),
  //     monthly_type: this.monthly_type,
  //     monthly_date: this.reoccuranceForm.value.monthly_date,
  //     monthly_count: this.reoccuranceForm.value.monthly_count,
  //     monthly_week: this.reoccuranceForm.value.monthly_week,
  //     monthly_day: this.reoccuranceForm.value.monthly_day,
  //     yearly_type: this.reoccuranceForm.value.yearly_type,
  //     yearly_date: this.reoccuranceForm.value.yearly_date,
  //     yearly_month: this.reoccuranceForm.value.yearly_month,
  //     yearly_week: this.reoccuranceForm.value.yearly_week,
  //     yearly_day: this.reoccuranceForm.value.yearly_day,
  //   };
  //   if (this.mode == "create" || this.mode == "target-task") {
  //     this.taskService.createTask(body).subscribe((res) => {
  //       if (res.success == "true") {
  //         this.toastrMessageService.showSuccess("Task Created Successfully.");
  //         this.taskForm.reset();
  //         this.router.navigate(["/dashboard"]);
  //         this.modalRef.hide();
  //       } else {
  //         this.toastrMessageService.showError(res.message);
  //       }
  //     });
  //   } else {
  //     body["task_id"] = this.task.task.task_id;
  //     body["appointment_time"] = this.taskForm.value.appointment_time;
  //     body["estimated_time"] = this.taskForm.value.estimated_time;
  //     body["vehicle_id"] = this.taskForm.value.reg_number;

  //     this.taskService.updateTask(body).subscribe((res) => {
  //       if (res.success == "true") {
  //         this.toastrMessageService.showSuccess("Task Updated Successfully.");
  //         this.router.navigate(["/dashboard"]);
  //         this.modalRef.hide();
  //         this.taskForm.reset();
  //       } else {
  //         this.toastrMessageService.showError(res.message);
  //       }
  //     });
  //   }
  // }

}
