import { Component, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe } from "@angular/common";
import { JournalDetails } from "../../models/journal.model";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { IntlService } from "@progress/kendo-angular-intl";
import { LocaleService } from "@app/core/services/locale/locale.services";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accSwift-edit-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./edit-journal.component.css"],
  providers: [DatePipe],
})
export class EditJournalComponent implements OnInit {
  private editedRowIndex: number;
  //Input Field Property

  numericFormat: string = "n2";
  public decimals: number = 2;
  journalVoucherForms: FormGroup;
  journalDetail: JournalDetails;
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
    public intlService: IntlService,
    private localeService: LocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.set("en-US");
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
            this.buildJournalForm();
            this.setJournalList();
          });
      }
    });
  }

  buildJournalForm(): void {
    this.journalVoucherForms = this._fb.group({
      seriesId: [this.journalDetail ? this.journalDetail.SeriesID : null],
      voucherNo: [this.journalDetail ? this.journalDetail.VoucherNo : ""],
      date: [
        this.journalDetail ? new Date(this.journalDetail.CreatedDate) : "",
      ],
      projectId: [this.journalDetail ? this.journalDetail.ProjectID : null],
      narration: [this.journalDetail ? this.journalDetail.Remarks : ""],
      journalEntryList: [this.addJournalEntryFormGroup()],
    });
  }

  addJournalEntryFormGroup(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      ledgerID: [""],
      debit: ["", Validators.required],
      credit: [""],
      balance: [""],
      remarks: [""],
    });
  }

  setJournalList(): void {
    this.journalVoucherForms.setControl(
      "journalEntryList",
      this.setJournalFormArray(this.journalDetail.Journaldetails)
    );
  }

  get getjournalEntryList(): FormArray {
    return <FormArray>this.journalVoucherForms.get("journalEntryList");
  }

  // this block of code is used to show form array data in the template.....
  setJournalFormArray(journaldetails): FormArray {
    const journalFormArray = new FormArray([]);
    if (journaldetails && journaldetails.length > 0) {
      journaldetails.forEach((element) => {
        journalFormArray.push(
          this._fb.group({
            ledgerCode: [element.LedgerCode ? element.LedgerCode : ""],
            particularsOraccountingHead: [
              element.LedgerName,
              Validators.required,
            ],
            ledgerID: element.MasterID,
            debit: [
              {
                value: element.DebitCredit === "Debit" ? element.Amount : "",
                disabled: element.DebitCredit === "Credit" ? true : false,
              },
            ],
            credit: [
              {
                value: element.DebitCredit === "Credit" ? element.Amount : "",
                disabled: element.DebitCredit === "Debit" ? true : false,
              },
            ],
            balance: element.Amount ? element.Amount : "",
            remarks: element.Remarks,
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
          ledgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          particularsOraccountingHead: ["", Validators.required],
          ledgerID: [""],
          debit: ["", Validators.required],
          credit: [""],
          balance: [{ value: "", disabled: false }],
          remarks: [""],
        })
      );
    }
    return journalFormArray;
  }

  checkDebitValue(event: Event, index: number): void {
    let debitValue = 0;
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("journalEntryList")
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
      this.journalVoucherForms.get("journalEntryList")
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

  changeLedgerValue(dataItem, selectedRow): void {
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("journalEntryList")
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

  addJournalEntry(): void {
    this.submitted = true;
    if (this.journalVoucherForms.get("journalEntryList").invalid) return;

    (<FormArray>this.journalVoucherForms.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  journalEntryList = [];
  public save(): void {
    this.journalEntryList = [];
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("journalEntryList")
    );

    for (const key in journalEntryFormArray.value) {
      if (journalEntryFormArray.value[key]) {
        this.journalEntryList.push({
          DebitCredit: journalEntryFormArray.value[key].debit
            ? "Debit"
            : "Credit",
          LedgerID: journalEntryFormArray.value[key].ledgerID,
          LedgerCode: journalEntryFormArray.value[key].ledgerCode,
          LedgerBalance: journalEntryFormArray.value[key].balance,
          Amount: journalEntryFormArray.value[key].debit
            ? journalEntryFormArray.value[key].debit
            : journalEntryFormArray.value[key].credit,
          Remarks: journalEntryFormArray.value[key].remarks,
        });
      }
    }

    if (this.journalVoucherForms.invalid) return;
    const obj = {
      ID: this.journalDetail.ID,
      Date: this.journalVoucherForms.get("date").value,
      Journaldetails: this.journalEntryList,
      SeriesID: this.journalVoucherForms.get("seriesId").value,
      Fields: {
        Field1: "",
        Field2: "",
        Field3: "",
        Field4: "",
        Field5: "",
      },
      VoucherNo: this.journalVoucherForms.get("voucherNo").value,
      ProjectID: this.journalVoucherForms.get("projectId").value,
      Remarks: this.journalVoucherForms.get("narration").value,
    };
    this.journalService.updateJournalVoucher(obj).subscribe(
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

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const journalEntryFormArray = <FormArray>(
          this.journalVoucherForms.get("journalEntryList")
        );
        journalEntryFormArray.controls[index]
          .get("balance")
          .setValue(data.ActualBalance);
        journalEntryFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
        journalEntryFormArray.controls[index]
          .get("ledgerID")
          .setValue(data.LedgerID);
        journalEntryFormArray.controls[index]
          .get("ledgerCode")
          .setValue(data.LedgerCode);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  // knedo uI
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.journalVoucherForms.get("journalEntryList").invalid) return;
    (<FormArray>this.journalVoucherForms.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("journalEntryList")
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
    sender.editRow(rowIndex, this.journalVoucherForms.get("journalEntryList"));
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
      this.journalVoucherForms.get("journalEntryList")
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
    (<FormArray>this.journalVoucherForms.get("journalEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
