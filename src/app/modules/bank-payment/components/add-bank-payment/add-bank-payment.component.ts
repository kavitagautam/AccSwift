import { Router } from "@angular/router";
import { LedgerCodeMatchService } from "@shared/services/ledger-code-match/ledger-code-match.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { BankPaymentService } from "./../../services/bank-payment.service";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-add-bank-payment",
  templateUrl: "./add-bank-payment.component.html",
  styleUrls: ["./add-bank-payment.component.scss"],
})
export class AddBankPaymentComponent implements OnInit {
  addBankPaymentForm: FormGroup;
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
    centered: true,
    class: "modal-lg",
  };

  constructor(
    public bankPaymentService: BankPaymentService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildAddBankPaymentForm(); //Initialize the Form....
  }

  buildAddBankPaymentForm(): void {
    this.addBankPaymentForm = this.fb.group({
      SeriesID: [null],
      ProjectID: [null],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [null, [Validators.required]],
      Date: [new Date()],
      bankPaymentEntryList: this.fb.array([this.addBankPaymentEntryList()]),
    });
  }

  addBankPaymentEntryList(): FormGroup {
    return this.fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      ChequeNumber: [""],
      ChequeDate: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  get getBankPaymentEntryList(): FormArray {
    return <FormArray>this.addBankPaymentForm.get("bankPaymentEntryList");
  }

  addBankPaymentEntry(): void {
    this.submitted = true;
    if (this.addBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.addBankPaymentForm.get("bankPaymentEntryList")).push(
      this.addBankPaymentEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const bankPaymentFormArray = <FormArray>(
      this.addBankPaymentForm.get("bankPaymentEntryList")
    );
    const ledgerCode = bankPaymentFormArray.controls[rowIndex].get("LedgerCode")
      .value;
    if (
      bankPaymentFormArray.controls[rowIndex].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.addBankPaymentForm.valid) {
      this.bankPaymentService
        .addBankPayment(this.addBankPaymentForm.value)
        .subscribe(
          (response) => {
            this.router.navigate(["/bank-payment"]);
          },
          (error) => {
            this.toastr.error(JSON.stringify(error.error.Message));
          },
          () => {
            this.toastr.success("Banl Payment added successfully");
          }
        );
      this.router.navigate(["/bank-payment"]);
    } else {
    }
  }

  public cancel(): void {
    this.addBankPaymentForm.reset();
    this.router.navigate(["/bank-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.addBankPaymentForm.get("bankPaymentEntryList")).push(
      this.addBankPaymentEntryList()
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
      this.addBankPaymentForm.get("bankPaymentEntryList")
    );
    bankPaymentEntry.controls[rowIndex]
      .get("particularsOraccountinHead")
      .setValue(dataItem.particularsOrAccountingHead);
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
      this.addBankPaymentForm.get("bankPaymentEntryList")
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
        const bankPaymentFormArray = <FormArray>(
          this.addBankPaymentForm.get("bankPaymentEntryList")
        );
        bankPaymentFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        bankPaymentFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        bankPaymentFormArray.controls[index]
          .get("LedgerName")
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
    const bankPaymentEntry = <FormArray>(
      this.addBankPaymentForm.get("bankPaymentEntryList")
    );
    // Remove the Row
    (<FormArray>this.addBankPaymentForm.get("bankPaymentEntryList")).removeAt(
      rowIndex
    );
  }
}
