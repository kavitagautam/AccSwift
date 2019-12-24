import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BankPaymentService } from "../../services/bank-payment.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { Router } from "@angular/router";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "app-edit-bank-payment",
  templateUrl: "./edit-bank-payment.component.html",
  styleUrls: ["./edit-bank-payment.component.scss"]
})
export class EditBankPaymentComponent implements OnInit {
  editBankPaymentForm: FormGroup;
  private editedRowIndex: number;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };
  constructor(
    public bankPaymentService: BankPaymentService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildEditBankPaymentForm();
  }

  buildEditBankPaymentForm() {
    this.editBankPaymentForm = this.fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      bankAccount: [""],
      cashParty: [""],
      date: [],
      bankPaymentEntryList: this.fb.array([
        this.editBankPaymentEntryFormGroup()
      ])
    });
  }

  editBankPaymentEntryFormGroup(): FormGroup {
    return this.fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      chequeNo: [""],
      chequeBank: [""],
      chequeDate: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  get getBankPaymentEntryList(): FormArray {
    return <FormArray>this.editBankPaymentForm.get("bankPaymentEntryList");
  }

  editBankPaymentEntry(): void {
    this.submitted = true;
    if (this.editBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).push(
      this.editBankPaymentEntryFormGroup()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const bankPaymentFormArray = <FormArray>(
      this.editBankPaymentForm.get("bankPaymentEntryList")
    );
    const ledgerCode = bankPaymentFormArray.controls[rowIndex].get("ledgerCode")
      .value;
    if (
      bankPaymentFormArray.controls[rowIndex].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankPaymentFormArray.controls[rowIndex]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankPaymentFormArray.controls[rowIndex]
            .get("particularsOraccountinHead")
            .setValue(selectedItem[0].LedgerName);
          bankPaymentFormArray.controls[rowIndex]
            .get("currentBalance")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.editBankPaymentForm.valid) {
      this.router.navigate(["/cash-payment"]);
    } else {
    }
  }

  public cancel(): void {
    this.editBankPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).push(
      this.editBankPaymentEntryFormGroup()
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
    );
    bankPaymentEntry.controls[rowIndex]
      .get("particularsOraccountinHead")
      .setValue(dataItem.particularsOraccountingHead);
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
    );
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const bankPaymentFormArray = <FormArray>(
          this.editBankPaymentForm.get("bankPaymentEntryList")
        );
        bankPaymentFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        bankPaymentFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
    );
    // Remove the Row
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).removeAt(
      rowIndex
    );
  }
}
