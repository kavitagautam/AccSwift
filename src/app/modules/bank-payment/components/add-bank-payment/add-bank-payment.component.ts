import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { BankPaymentService } from "./../../services/bank-payment.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "../../../preference/services/preference.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";

@Component({
  selector: "accSwift-add-bank-payment",
  templateUrl: "../common-html/common-bank-payment.html",
  styleUrls: ["./add-bank-payment.component.scss"],
})
export class AddBankPaymentComponent implements OnInit {
  bankPaymentForm: FormGroup;
  private editedRowIndex: number;
  currentAmount: string = "0.00";
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    public bankPaymentService: BankPaymentService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildBankPaymentForm(); //Initialize the Form....
  }

  buildBankPaymentForm(): void {
    this.bankPaymentForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_BANK_PMNT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
      ],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_BANK_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      Date: [new Date()],
      Remarks: [""],
      BankPaymentDetailsList: this._fb.array([this.addBankPaymentEntryList()]),
    });
  }

  addBankPaymentEntryList(): FormGroup {
    return this._fb.group({
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: [""],
      ChequeNumber: [""],
      ChequeDate: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  get getBankPaymentEntryList(): FormArray {
    return <FormArray>this.bankPaymentForm.get("BankPaymentDetailsList");
  }

  addBankPaymentEntry(): void {
    this.submitted = true;
    if (this.bankPaymentForm.get("BankPaymentDetailsList").invalid) return;
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
      this.addBankPaymentEntryList()
    );
    this.submitted = false;
  }

  changeAccount(event, ledgerId): void {
    this.bankPaymentService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const bankPaymentFormArray = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
    const ledgerCode = bankPaymentFormArray.controls[rowIndex].get("LedgerCode")
      .value;
    if (
      bankPaymentFormArray.controls[rowIndex].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
      (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
        this.addBankPaymentEntryList()
      );
    }
  }

  public save(): void {
    if (this.bankPaymentForm.invalid) return;
    this.bankPaymentService
      .addBankPayment(this.bankPaymentForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-payment"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Payment added successfully");
        }
      );
  }

  public cancel(): void {
    this.bankPaymentForm.reset();
    this.router.navigate(["/bank-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.bankPaymentForm.get("BankPaymentDetailsList").invalid) return;
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
      this.addBankPaymentEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankPaymentEntry = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
    bankPaymentEntry.controls[rowIndex]
      .get("particularsOraccountinHead")
      .setValue(dataItem.particularsOrAccountingHead);
    bankPaymentEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    bankPaymentEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    bankPaymentEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    bankPaymentEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
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
        const bankPaymentFormArray = <FormArray>(
          this.bankPaymentForm.get("BankPaymentDetailsList")
        );
        bankPaymentFormArray.controls[index]
          .get("LedgerID")
          .setValue(data.LedgerID);
        bankPaymentFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        bankPaymentFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        bankPaymentFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
      }
      (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
        this.addBankPaymentEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
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
    const bankPaymentEntry = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
    // Remove the Row
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).removeAt(
      rowIndex
    );
  }
}
