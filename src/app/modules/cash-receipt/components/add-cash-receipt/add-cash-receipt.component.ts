import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "../../../preference/services/preference.service";
import { IconConst } from "@app/shared/constants/icon.constant";

@Component({
  selector: "accSwift-add-cash-receipt",
  templateUrl: "../common-html/common-cash-receipt.html",
  styleUrls: ["./add-cash-receipt.component.scss"],
})
export class AddCashReceiptComponent implements OnInit {
  cashReceiptForm: FormGroup;

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
    public cashReceiptService: CashReceiptService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private preferenceService: PreferenceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildcashReceiptForm();
  }

  buildcashReceiptForm(): void {
    this.cashReceiptForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_CASH_RCPT.Value
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
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      Date: [new Date()],
      Remarks: [""],
      CashReceiptDetails: this._fb.array([this.addCashReceiptEntryFormGroup()]),
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.cashReceiptForm.get("CashReceiptDetails");
  }

  addCashReceiptEntryFormGroup(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      VoucherNumber: [""],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.cashReceiptForm.get("CashReceiptDetails").invalid) return;

    (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  //Ledger Code entirng Filed -- not used recently
  changeLedgerValue(dataItem, selectedRow): void {
    const cashReceiptFormArray = <FormArray>(
      this.cashReceiptForm.get("CashReceiptDetails")
    );

    const ledgerCode = cashReceiptFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      cashReceiptFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
        }
        (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
          this.addCashReceiptEntryFormGroup()
        );
      });
    }
  }

  public save(): void {
    if (this.cashReceiptForm.invalid) return;
    this.cashReceiptService
      .addCashReceipt(this.cashReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/cash-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Cash  Receipt added successfully");
        }
      );
  }

  public cancel(): void {
    this.cashReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }
}
