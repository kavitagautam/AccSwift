import { FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { BankReconciliationService } from "./../../services/bank-reconciliation.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";

@Component({
  selector: "accSwift-add-bank-reconciliation",
  templateUrl: "../common-html/bank-reconciliation.html",
})
export class AddBankReconciliationComponent implements OnInit {
  bankReconciliationForm: FormGroup;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    public reconciliationService: BankReconciliationService,
    public toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    public preferenceService: PreferenceService
  ) {}

  ngOnInit() {
    this.buildbankReconciliationForm();
  }

  buildbankReconciliationForm() {
    this.bankReconciliationForm = this._fb.group({
      ID: [0],
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_BRECON.Value
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
          [Validators.required],],
      Date: [new Date()],
      BankReconciliationDetailsList: this._fb.array([
        this.addReconciliationEntryList(),
      ]),
    });
  }

  addReconciliationEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0, Validators.required],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      DrCr: [""],
      LedgerBalance: [""],
      Amount: [0],
      Remarks: [""],
    });
  }

  get getreconciliationEntryList(): FormArray {
    return <FormArray>(
      this.bankReconciliationForm.get("BankReconciliationDetailsList")
    );
  }

  addreconciliationEntry(): void {
    this.submitted = true;
    if (
      this.bankReconciliationForm.get("BankReconciliationDetailsList").invalid
    )
      return;

    (<FormArray>(
      this.bankReconciliationForm.get("BankReconciliationDetailsList")
    )).push(this.addReconciliationEntryList());
    this.submitted = false;
  }

  public save(): void {   
    if (this.bankReconciliationForm.invalid) return;
    this.reconciliationService
      .addBankRec(this.bankReconciliationForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-reconciliation"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Reconciliation added successfully");
        }
      );
      console.log(this.bankReconciliationForm.value);
  }

  public cancel(): void {
    this.bankReconciliationForm.reset();
    this.router.navigate(["/bank-reconciliation"]);
  }
}
