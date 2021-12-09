import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe, formatDate } from "@angular/common";
import { Journal } from "../../models/journal.model";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { IconConst } from "@app/shared/constants/icon.constant";
import { IntlService } from "@progress/kendo-angular-intl";
import { TimeZoneService } from "@accSwift-modules/accswift-shared/services/time-zone/time-zone.service";
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { DetailsEntryGridService } from '@accSwift-modules/accswift-shared/services/details-entry-grid/details-entry-grid.service';
import { DateConverterComponent } from "@accSwift-modules/accswift-shared/components/date-converter/date-converter.component";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { Settings } from '@accSwift-modules/settings/models/settings.model';
import { RecurringInvoiceComponent } from "@accSwift-modules/accswift-shared/components/recurring-invoice/recurring-invoice.component";
import { NepaliDatePickerSettings } from "@accSwift-modules/accswift-shared/models/nepali-date-settings";
var adbs = require("ad-bs-converter");
var moment = require ("moment")

@Component({
  selector: "accSwift-edit-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./edit-journal.component.css"],
  providers: [DatePipe, TimeZoneService],
})
export class EditJournalComponent implements OnInit {

  columns = [];
  dateToday: Date = new Date();
  private editedRowIndex: number;
  listLoading:boolean;
  settings: Settings;
  nepaliDatePickSettings:NepaliDatePickerSettings = {language: "english",
  dateFormat: "YYYY-MM-DD",
  ndpMonth: true,
  ndpYear: true}; 

  iconConst = IconConst;
  public selectedDate:string =''

  journalVoucherForms: FormGroup;
  settingsForm: FormGroup;
  journalDetail: Journal;
  submitted: boolean;
  rowSubmitted: boolean;
  debitTotal: number = 0;
  creditTotal: number = 0;
  differenceTotal: number = 0;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  pipe = new DatePipe("ne");

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    public gridServices: DetailsEntryGridService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService,
    public timeZone: TimeZoneService,
    public datePipe: DatePipe,
    private settingsService: SettingsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.buildJournalForm();
    // Get Id From the Route URL and get the Details
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        // this.listLoading = true;
        this.journalService
          .getJournalDetails(params.get("id"))
          .subscribe((response) => {
            this.journalDetail = response.Entity;
            console.log(this.journalDetail)
            if (this.journalDetail) {
              this.setJournalList();
              this.journalVoucherForms.patchValue(this.journalDetail);
            }
          },
          (error)=> {
            // this.listLoading = false;
          },
          ()=> {
            // this.listLoading = false;
          });
      }
    });
    this.buildSettingsForm();
    this.getSettings();
    // this.selectedDate= this.localStorageService.getLocalStorageItem(
    //   "SelectedDate");
    localStorage.removeItem("SelectedDate");

    for (const key in this.journalVoucherForms.controls.Journaldetails.value[0])
    {
      this.columns.push(key);
    }
  }

  ledgerLoadEvent(event):void {
    console.log('event');
    console.log(event);
    if(event == true) 
    {
      alert(true);
      document.getElementById('overlay').style.display == 'block';
    }

    else if (event == false)
    {
      alert(false);
      document.getElementById('overlay').style.display = 'none';
    }
  }


  closeModal(event):void {
    if(event == true){
      this.modalRef ? this.modalRef.hide():"";
    }
  }

  bsValue = new Date(); 

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

  buildJournalForm(): void {
    this.journalVoucherForms = this._fb.group({
      ID: [this.journalDetail ? this.journalDetail.ID : null],
      SeriesID: [this.journalDetail ? this.journalDetail.SeriesID : null],
      VoucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      // Date: [
      //   this.journalDetail
      //     ? this.pipe.transform((this.journalDetail.Date), "YYYY-MM-DD")
      //     : "",
      // ],
      Date: [this.journalDetail? new Date(this.journalDetail.Date): ""],
      ProjectID: [this.journalDetail ? this.journalDetail.ProjectID : null],
      Remarks: [this.journalDetail ? this.journalDetail.Remarks : ""],
      Journaldetails: this._fb.array([this.addJournalEntryFormGroup()]),
    });

    const now = new Date(this.journalVoucherForms.get("Date").value);
    const newDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    // console.log("New Date" + newDate);
    this.journalVoucherForms.get("Date").patchValue(newDate);
    // this.journalVoucherForms
    //   .get("Date")
    //   .patchValue(
    //     this.convetTimeZone(this.journalVoucherForms.get("Date").value)
    //   );
  }

  convetTimeZone(value): string {
    // console.log("Value" + value);
    const date = new Date(value);
    // console.log("Return Date " + date.toLocaleString());
    return date.toLocaleString();
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      TransactionSubLedger: this._fb.array([this.addSubLedgerFormGroup()]),
      ID: [null],
      MasterID: [null],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
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

  setJournalList(): void {
    this.journalVoucherForms.setControl(
      "Journaldetails",
      this.setJournalFormArray(this.journalDetail.Journaldetails)
    );
    (<FormArray>this.journalVoucherForms.get("Journaldetails")).push(
      this.addJournalEntryFormGroup()
    );
  }

  setSubLedgerList(): void {
    // this.journalVoucherForms.get(
    //   "Journaldetails",
    //   this.setSubLedgerListArray(this.ledgerDetails.SubLedgerList)
    // );
  }

  // this block of code is used to show form array data in the template.....
  setSubLedgerListArray(LedgerID): FormArray {
    const subLedger = new FormArray([]);

    let subLedgerList=[];
    this.gridServices
    .getSubLedgerMin(LedgerID)
      .subscribe((response) => {
        console.log(" Response" + JSON.stringify(response))
        subLedgerList=response.Entity;
        if (subLedgerList && subLedgerList.length > 0) {
          subLedgerList.forEach((element) => {
            subLedger.push(
              this._fb.group({
                ID: [element.ID],
                SubLedegerID: [element.SubLedegerID],
                Name: [element.Name],
                Amount: [element.Amount],
                DrCr: [element.DrCr],
                Remarks: [element.Remarks],
              })
            );
          });
        }
      });
      
      // console.log(" SublEdger Details for each ledger  " + JSON.stringify(subLedgerList))
   
    return subLedger;
  }

  get getjournalEntryList(): FormArray {
    return <FormArray>this.journalVoucherForms.get("Journaldetails");
  }

  // this block of code is used to show form array data in the template.....
  setJournalFormArray(journaldetails): FormArray {
    const journalFormArray = new FormArray([]);
    if (journaldetails && journaldetails.length > 0) {
      journaldetails.forEach((element) => {
        journalFormArray.push(
          this._fb.group({
            TransactionSubLedger: this.setSubLedgerListArray(
              element.LedgerID
            ),
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerCode: [element.LedgerCode ? element.LedgerCode : ""],
            LedgerName: [element.LedgerName, Validators.required],
            LedgerID: [element.LedgerID],
            DrAmount: [element.DrAmount],
            CrAmount: [element.CrAmount],
            LedgerBalance: [element.LedgerBalance],
            Remarks: [element.Remarks],
          })
        );
        if (element.DrAmount !== null) {
          this.debitTotal = +parseInt(element.DrAmount) || 0;
        }
        if (element.CrAmount !== null) {
          this.creditTotal = +parseInt(element.CrAmount) || 0;
        }
      });
    } else {
      journalFormArray.push(
        this._fb.group({
          TransactionSubLedger: this._fb.array([this.addSubLedgerFormGroup()]),
          ID: [null],
          MasterID: [null],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: [""],
          LedgerID: [""],
          DrAmount: [""],
          CrAmount: [""],
          LedgerBalance: [""],
          Remarks: [""],
        })
      );
    }
    return journalFormArray;
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
    
    this.journalService
      .updateJournalVoucher(this.journalVoucherForms.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/journal"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Journal edited successfully");
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
}
