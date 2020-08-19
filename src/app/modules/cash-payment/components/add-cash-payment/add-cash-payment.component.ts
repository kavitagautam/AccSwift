import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CashPaymentService } from "../../services/cash-payment.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { PreferenceService } from "../../../preference/services/preference.service";

@Component({
  selector: "accSwift-add-cash-payment",
  templateUrl: "../common-html/common-cash-payment.html",
  styleUrls: ["./add-cash-payment.component.scss"],
})
export class AddCashPaymentComponent implements OnInit {
  cashPaymentForm: FormGroup;
  submitted: boolean;
  currentAmount: string = "0.00";
  rowSubmitted: boolean;
  editedRowIndex: any;

  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    public cashPaymentService: CashPaymentService,
    private _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public ledgerCodeService: LedgerCodeMatchService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildCashPaymentForm(); // initialize the form
  }

  buildCashPaymentForm(): void {
    this.cashPaymentForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_CASH_PMNT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
        Validators.required,
      ],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      Date: [new Date()],
      CashPaymentDetailsList: this._fb.array([this.addCashPaymentEntryList()]),
    });
  }

  addCashPaymentEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  get getCashPaymentEntryList(): FormArray {
    const cashPaymentFormArray = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );
    return cashPaymentFormArray;
  }

  public save(): void {
    if (this.cashPaymentForm.invalid) return;
    this.cashPaymentService
      .addCashPayment(this.cashPaymentForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/cash-payment"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Cash Payment added successfully");
        }
      );
  }

  public cancel(): void {
    this.cashPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }
}
