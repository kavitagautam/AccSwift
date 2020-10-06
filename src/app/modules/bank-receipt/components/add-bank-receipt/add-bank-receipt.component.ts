import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "../../../preference/services/preference.service";

@Component({
  selector: "accswift-add-bank-receipt",
  templateUrl: "../common-html/common-bank-receipt.html",
  styleUrls: ["./add-bank-receipt.component.scss"],
})
export class AddBankReceiptComponent implements OnInit {
  bankReceiptForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
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
    private modalService: BsModalService,
    public bankReceiptService: BankReceiptService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildBankReceiptForm();
  }

  buildBankReceiptForm(): void {
    this.bankReceiptForm = this._fb.group({
      ID: [null],
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_BANK_RCPT.Value
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
      BankReceiptDetailsList: this._fb.array([this.addBankReceiptEntryList()]),
    });
  }

  get getBankReceiptEntryList(): FormArray {
    return <FormArray>this.bankReceiptForm.get("BankReceiptDetailsList");
  }

  addBankReceiptEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: [""],
      VoucherNumber: [""],
      ChequeNumber: [""],
      ChequeBank: [""],
      ChequeDate: [""],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  addBankReceiptEntry(): void {
    this.submitted = true;
    if (this.bankReceiptForm.get("BankReceiptDetailsList").invalid) return;

    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptEntryList()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.bankReceiptForm.invalid) return;
    this.bankReceiptService
      .addBankReceipt(this.bankReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Receipt added successfully");
        }
      );
  }

  public cancel(): void {
    this.bankReceiptForm.reset();
    this.router.navigate(["/bank-receipt"]);
  }
}
