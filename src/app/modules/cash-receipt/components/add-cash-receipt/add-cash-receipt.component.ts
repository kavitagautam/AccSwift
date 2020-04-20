import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-add-cash-receipt",
  templateUrl: "../common-html/common-cash-receipt.html",
  styleUrls: ["./add-cash-receipt.component.scss"],
})
export class AddCashReceiptComponent implements OnInit {
  cashReceiptForm: FormGroup;
  private editedRowIndex: number;
  currentAmount: string = "0.00";
  numericFormat: string = "n2";
  public decimals: number = 2;
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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildcashReceiptForm();
  }

  buildcashReceiptForm(): void {
    this.cashReceiptForm = this._fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [null, [Validators.required]],
      Date: [new Date()],
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

  changeAccount(event, ledgerId): void {
    this.cashReceiptService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

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

  public addHandler({ sender }): void {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashReceiptForm.get("CashReceiptDetails").invalid) return;
    (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }): void {
    this.closeEditor(sender);
    const cashReceiptEntry = <FormArray>(
      this.cashReceiptForm.get("CashReceiptDetails")
    );
    cashReceiptEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.particularsOraccountingHead);
    cashReceiptEntry.controls[rowIndex]
      .get("VoucherNo")
      .setValue(dataItem.voucherNo);
    cashReceiptEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.currentAmount);
    cashReceiptEntry.controls[rowIndex]
      .get("VoucherType")
      .setValue(dataItem.vType);
    cashReceiptEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.cashReceiptForm.get("cashReceiptEntryList"));
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
        const cashReceiptFormArray = <FormArray>(
          this.cashReceiptForm.get("CashReceiptDetails")
        );
        cashReceiptFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        cashReceiptFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
        cashReceiptFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        cashReceiptFormArray.controls[index]
          .get("LedgerID")
          .setValue(data.LedgerID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public cancelHandler({ sender, rowIndex }): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    //Save code
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const cashReceiptEntry = <FormArray>(
      this.cashReceiptForm.get("CashReceiptDetails")
    );

    // Remove the Row
    (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
