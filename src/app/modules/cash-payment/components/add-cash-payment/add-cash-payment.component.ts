import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CashPaymentService } from "../../services/cash-payment.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
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

  changeAccount(event, ledgerId): void {
    this.cashPaymentService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const cashPaymentFormArray = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );

    const ledgerCode = cashPaymentFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      cashPaymentFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .disable();
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
        (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
          this.addCashPaymentEntryList()
        );
      });
    }
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    // this.modalRef.content = index;
    // this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const cashPaymentFormArray = <FormArray>(
          this.cashPaymentForm.get("CashPaymentDetailsList")
        );
        cashPaymentFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        cashPaymentFormArray.controls[index]
          .get("LedgerID")
          .setValue(data.LedgerID);
        cashPaymentFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        cashPaymentFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
      }
      (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
        this.addCashPaymentEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashPaymentForm.get("CashPaymentDetailsList").invalid) return;
    (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
      this.addCashPaymentEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public saveHandler({ sender, rowIndex, dataItem }) {
    // Do save Work Later
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashPaymentEntry = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.LedgerName);
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerCode")
      .setValue(dataItem.LedgerCode);
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.LedgerBalance);
    cashPaymentEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }) {
    (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
