import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { ToastrService } from "ngx-toastr";

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
  currentAmount: string = "0.00";
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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildBankReceiptForm();
  }

  buildBankReceiptForm(): void {
    this.bankReceiptForm = this._fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [null, [Validators.required]],
      Date: [new Date()],
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
      LedgerName: ["", Validators.required],
      VoucherNo: [""],
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

  changeAccount(event, ledgerId): void {
    this.bankReceiptService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const bankReceiptFormArray = <FormArray>(
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );

    const ledgerCode = bankReceiptFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      bankReceiptFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
        }
      });
    }
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

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.bankReceiptForm.get("BankReceiptDetailsList").invalid) return;
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankReceiptEntry = <FormArray>(
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );
    bankReceiptEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.LedgerName);
    bankReceiptEntry.controls[rowIndex]
      .get("VoucherNo")
      .setValue(dataItem.VoucherNo);
    bankReceiptEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.LedgerBalance);
    bankReceiptEntry.controls[rowIndex]
      .get("VoucherType")
      .setValue(dataItem.VoucherType);
    bankReceiptEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.Remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.bankReceiptForm.get("BankReceiptDetailsList")
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
        const bankReceiptFormArray = <FormArray>(
          this.bankReceiptForm.get("BankReceiptDetailsList")
        );
        bankReceiptFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        bankReceiptFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
        bankReceiptFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
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
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );

    // Remove the Row
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
