import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accswift-add-bank-receipt",
  templateUrl: "../common-html/common-bank-receipt.html",
  styleUrls: ["./add-bank-receipt.component.scss"],
})
export class AddBankReceiptComponent implements OnInit {
  private editedRowIndex: number;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  currentBankAmount: string = "0.00";
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
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.buildBankReceiptForm();
    this.bankReceiptService.init();
  }

  buildBankReceiptForm(): void {
    this.bankReceiptForm = this._fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: ["", [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      date: [new Date()],
      bankReceiptEntryList: this._fb.array([this.addBankReceiptEntryList()]),
    });
  }

  get getBankReceiptEntryList(): FormArray {
    return <FormArray>this.bankReceiptForm.get("bankReceiptEntryList");
  }

  addBankReceiptEntryList(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      chequeNo: [""],
      chequeBank: [""],
      chequeDate: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""],
    });
  }

  addBankReceiptEntry(): void {
    this.submitted = true;
    if (this.bankReceiptForm.get("bankReceiptEntryList").invalid) return;

    (<FormArray>this.bankReceiptForm.get("bankReceiptEntryList")).push(
      this.addBankReceiptEntryList()
    );
    this.submitted = false;
  }

  changeBankAccount(event, ledgerId): void {
    this.bankReceiptService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentBankAmount = response.Entity[0].Balance;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const bankReceiptFormArray = <FormArray>(
      this.bankReceiptForm.get("bankReceiptEntryList")
    );

    const ledgerCode = bankReceiptFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      bankReceiptFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankReceiptFormArray.controls[selectedRow]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankReceiptFormArray.controls[selectedRow]
            .get("particularsOraccountingHead")
            .setValue(selectedItem[0].LedgerName);
          bankReceiptFormArray.controls[selectedRow]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.bankReceiptForm.valid) {
      this.router.navigate(["/bank-receipt"]);
    } else {
    }
  }

  public cancel(): void {
    this.bankReceiptForm.reset();
    this.router.navigate(["/bank-receipt"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.bankReceiptForm.get("bankReceiptEntryList").invalid) return;
    (<FormArray>this.bankReceiptForm.get("bankReceiptEntryList")).push(
      this.addBankReceiptEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankReceiptEntry = <FormArray>(
      this.bankReceiptForm.get("bankReceiptEntryList")
    );
    bankReceiptEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    bankReceiptEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    bankReceiptEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    bankReceiptEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    bankReceiptEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.bankReceiptForm.get("bankReceiptEntryList"));
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
        const bankReceiptFormArray = <FormArray>(
          this.bankReceiptForm.get("bankReceiptEntryList")
        );
        bankReceiptFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        bankReceiptFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
      }
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
    const bankReceiptEntry = <FormArray>(
      this.bankReceiptForm.get("bankReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.bankReceiptForm.get("bankReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
