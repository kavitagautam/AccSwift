import { Component, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe } from "@angular/common";
import { Journal } from "../../models/journal.model";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { IntlService } from "@progress/kendo-angular-intl";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { IconConst } from "@app/shared/constants/icon.constant";

@Component({
  selector: "accSwift-edit-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./edit-journal.component.css"],
  providers: [DatePipe],
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

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    @Inject(LOCALE_ID) public localeId: string,
    public intlService: IntlService,
    private toastr: ToastrService
  ) {
    //this.localeService.set("en-US");
  }

  ngOnInit() {
    this.buildJournalForm();
    // Get Id From the Route URL and get the Details
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.journalService
          .getJournalDetails(params.get("id"))
          .subscribe((response) => {
            this.journalDetail = response.Entity;
            //this.buildJournalForm();
            if (this.journalDetail) {
              this.setJournalList();
              this.assignFormsValue();
            }
          });
      }
    });
  }

  assignFormsValue(): void {
    this.journalVoucherForms.get("ID").setValue(this.journalDetail.ID);
    this.journalVoucherForms
      .get("SeriesID")
      .setValue(this.journalDetail.SeriesID);
    this.journalVoucherForms
      .get("VoucherNo")
      .setValue(this.journalDetail.VoucherNo);

    this.journalVoucherForms
      .get("ProjectID")
      .setValue(this.journalDetail.ProjectID);
    this.journalVoucherForms
      .get("Date")
      .setValue(new Date(this.journalDetail.CreatedDate));
    this.journalVoucherForms
      .get("Remarks")
      .setValue(this.journalDetail.Remarks);
  }

  buildJournalForm(): void {
    this.journalVoucherForms = this._fb.group({
      ID: [this.journalDetail ? this.journalDetail.ID : null],
      SeriesID: [this.journalDetail ? this.journalDetail.SeriesID : null],
      VoucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      Date: [
        this.journalDetail ? new Date(this.journalDetail.CreatedDate) : "",
      ],
      ProjectID: [this.journalDetail ? this.journalDetail.ProjectID : null],
      Remarks: [this.journalDetail ? this.journalDetail.Remarks : ""],
      Journaldetails: this._fb.array([this.addJournalEntryFormGroup()]),
    });
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      MasterID: [null],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      LedgerID: [""],
      DebitCredit: ["", Validators.required],
      Amount: [""],
      LedgerBalance: [""],
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
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerCode: [element.LedgerCode ? element.LedgerCode : ""],
            LedgerName: [element.LedgerName, Validators.required],
            LedgerID: [element.LedgerID],
            DebitCredit: [element.DebitCredit],
            Amount: [element.Amount],
            LedgerBalance: [element.LedgerBalance],
            Remarks: [element.Remarks],
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
          ID: [null],
          MasterID: [null],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: [""],
          LedgerID: [""],
          DebitCredit: ["", Validators.required],
          Amount: ["", Validators.required],
          LedgerBalance: [""],
          Remarks: [""],
        })
      );
    }
    return journalFormArray;
  }

  journalPrint(): void {
    this.router.navigate(
      [
        `/journal/edit/${
          this.journalVoucherForms.get("ID").value
        }/invoice-billing`,
      ],
      { state: this.journalVoucherForms.value }
    );
    localStorage.setItem(
      "journal",
      JSON.stringify(this.journalVoucherForms.value)
    );
  }

  public save(): void {
    // if (this.journalVoucherForms.invalid) return;
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
