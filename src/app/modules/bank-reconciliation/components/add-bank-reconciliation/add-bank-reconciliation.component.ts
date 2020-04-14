import { FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";
import { LedgerCodeMatchService } from "@shared/services/ledger-code-match/ledger-code-match.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { BankReconciliationService } from "./../../services/bank-reconciliation.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accSwift-add-bank-reconciliation",
  templateUrl: "./add-bank-reconciliation.component.html",
  styleUrls: ["./add-bank-reconciliation.component.scss"],
})
export class AddBankReconciliationComponent implements OnInit {
  addReconciliationForm: FormGroup;
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
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.buildAddReconciliationForm();
  }

  buildAddReconciliationForm() {
    this.addReconciliationForm = this._fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: ["", [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      date: [new Date()],
      reconciliationEntryList: this._fb.array([
        this.addReconciliationEntryList(),
      ]),
    });
  }

  addReconciliationEntryList(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOrAccountingHead: ["", Validators.required],
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

  get getreconciliationEntryList(): FormArray {
    return <FormArray>this.addReconciliationForm.get("reconciliationEntryList");
  }

  addreconciliationEntry(): void {
    this.submitted = true;
    if (this.addReconciliationForm.get("reconciliationEntryList").invalid)
      return;

    (<FormArray>this.addReconciliationForm.get("reconciliationEntryList")).push(
      this.addReconciliationEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const reconciliationFormArray = <FormArray>(
      this.addReconciliationForm.get("reconciliationEntryList")
    );

    const ledgerCode = reconciliationFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      reconciliationFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          reconciliationFormArray.controls[selectedRow]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          reconciliationFormArray.controls[selectedRow]
            .get("particularsOrAccountingHead")
            .setValue(selectedItem[0].LedgerName);
          reconciliationFormArray.controls[selectedRow]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }
  public save(): void {
    if (this.addReconciliationForm.valid) {
      this.router.navigate(["/bank-reconciliation"]);
    } else {
    }
  }

  public cancel(): void {
    this.addReconciliationForm.reset();
    this.router.navigate(["/bank-reconciliation"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addReconciliationForm.get("reconciliationEntryList").invalid)
      return;
    (<FormArray>this.addReconciliationForm.get("reconciliationEntryList")).push(
      this.addReconciliationEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const reconciliationEntry = <FormArray>(
      this.addReconciliationForm.get("reconciliationEntryList")
    );
    reconciliationEntry.controls[rowIndex]
      .get("particularsOrAccountingHead")
      .setValue(dataItem.particularsOrAccountingHead);
    reconciliationEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    reconciliationEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    reconciliationEntry.controls[rowIndex]
      .get("vType")
      .setValue(dataItem.vType);
    reconciliationEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.addReconciliationForm.get("reconciliationEntryList")
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
        const reconciliationFormArray = <FormArray>(
          this.addReconciliationForm.get("reconciliationEntryList")
        );
        reconciliationFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        reconciliationFormArray.controls[index]
          .get("particularsOrAccountingHead")
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
    const bankReconciliationEntry = <FormArray>(
      this.addReconciliationForm.get("reconciliationEntryList")
    );

    // Remove the Row
    (<FormArray>bankReconciliationEntry).removeAt(rowIndex);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
