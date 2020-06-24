import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { JournalService } from "../../services/journal.service";
import { DatePipe } from "@angular/common";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { PreferenceService } from "../../../preference/services/preference.service";
import { Preferences } from "../../../preference/models/preference.model";

@Component({
  selector: "accSwift-add-journal",
  templateUrl: "../common-html/journal-voucher.html",
  styleUrls: ["./add-journal.component.scss"],
  providers: [DatePipe],
})
export class AddJournalComponent implements OnInit {
  private editedRowIndex: number;
  //Input Field Property
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

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public journalService: JournalService,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit() {
    this.buildjournalVoucherForms();
    this.getPreferences();
  }

  getPreferences(): void {
    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceData = response.Entity;
      this.buildjournalVoucherForms();
    });
  }

  buildjournalVoucherForms(): void {
    this.journalVoucherForms = this._fb.group({
      seriesId: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_JRNL.Value
          : null,
      ],
      voucherNo: ["", [Validators.required]],
      date: [new Date()],
      projectId: [
        this.preferenceData ? this.preferenceData.DEFAULT_PROJECT.Value : null,
      ],
      narration: [""],
      journalEntryList: this._fb.array([this.addJournalEntryFormGroup()]),
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
  get getjournalEntryList(): FormArray {
    return <FormArray>this.journalVoucherForms.get("journalEntryList");
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
    // calculate the total debit
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

  addJournalEntry(): FormArray {
    this.submitted = true;
    if (this.journalVoucherForms.get("journalEntryList").invalid) return;

    (<FormArray>this.journalVoucherForms.get("journalEntryList")).push(
      this.addJournalEntryFormGroup()
    );
    this.submitted = false;
  }

  deleteJournalEntryRow(index: number): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const journalEntryFormArray = <FormArray>(
      this.journalVoucherForms.get("journalEntryList")
    );
    const deletedCreditValue =
      journalEntryFormArray.controls[index].get("credit").value || 0;
    if (parseFloat(deletedCreditValue) > 0) {
      this.creditTotal = this.creditTotal - parseFloat(deletedCreditValue) || 0;
    }
    const deletedDebitValue =
      journalEntryFormArray.controls[index].get("debit").value || 0;
    if (parseFloat(deletedDebitValue) > 0) {
      this.debitTotal = this.debitTotal - parseFloat(deletedDebitValue) || 0;
    }
    // Remove the Row
    (<FormArray>this.journalVoucherForms.get("journalEntryList")).removeAt(
      index
    );
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
    this.journalService.addJournalVoucher(obj).subscribe(
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
    //Save Code
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
