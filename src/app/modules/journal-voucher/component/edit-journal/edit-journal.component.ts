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
@Component({
  selector: "accSwift-edit-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./edit-journal.component.css"],
  providers: [DatePipe, TimeZoneService],
})
export class EditJournalComponent implements OnInit {
  private editedRowIndex: number;
  iconConst = IconConst;

  journalVoucherForms: FormGroup;
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
    private modalService: BsModalService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService,
    public timeZone: TimeZoneService
  ) {}

  ngOnInit() {
    this.buildJournalForm();
    // Get Id From the Route URL and get the Details
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.journalService
          .getJournalDetails(params.get("id"))
          .subscribe((response) => {
            this.journalDetail = response.Entity;
            if (this.journalDetail) {
              this.setJournalList();
              this.journalVoucherForms.patchValue(this.journalDetail);
            }
          });
      }
    });
  }

  bsValue = new Date();

  buildJournalForm(): void {
    this.journalVoucherForms = this._fb.group({
      ID: [this.journalDetail ? this.journalDetail.ID : null],
      SeriesID: [this.journalDetail ? this.journalDetail.SeriesID : null],
      VoucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      Date: [
        this.journalDetail
          ? this.pipe.transform(this.journalDetail.Date, "YYYY-MM-DD")
          : "",
      ],
      ProjectID: [this.journalDetail ? this.journalDetail.ProjectID : null],
      Remarks: [this.journalDetail ? this.journalDetail.Remarks : ""],
      Journaldetails: this._fb.array([this.addJournalEntryFormGroup()]),
    });

    const now = new Date(this.journalVoucherForms.get("Date").value);
    const newDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    console.log("New Date" + newDate);
    this.journalVoucherForms.get("Date").patchValue(newDate);
    // this.journalVoucherForms
    //   .get("Date")
    //   .patchValue(
    //     this.convetTimeZone(this.journalVoucherForms.get("Date").value)
    //   );
  }

  convetTimeZone(value): string {
    console.log("Value" + value);
    const date = new Date(value);
    console.log("Return Date " + date.toLocaleString());
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
  setSubLedgerListArray(subLedgerList): FormArray {
    const subLedger = new FormArray([]);
    if (subLedgerList && subLedgerList.length > 0) {
      subLedgerList.forEach((element) => {
        subLedger.push(
          this._fb.group({
            ID: [element.ID],
            SubLedgerID: [element.SubLedgerID],
            Name: [element.Name],
            Amount: [element.Amount],
            DrCr: [element.DrCr],
            Remarks: [element.Remarks],
          })
        );
      });
    }
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
              element.TransactionSubLedger
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

    // const now = new Date(this.journalVoucherForms.get("Date").value);
    // const newDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    // console.log("New Date" + newDate);
    // this.journalVoucherForms.get("Date").patchValue(newDate);
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

  public cancel(): void {
    this.journalVoucherForms.reset();
    this.router.navigate(["/journal"]);
  }
}
