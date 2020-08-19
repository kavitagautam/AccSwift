import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { BankPaymentService } from "./../../services/bank-payment.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "../../../preference/services/preference.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
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
      ID: [0],
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
}
