import { CashPaymentMaster } from "./../../models/cash-payments.model";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CashPaymentsService } from "./../../services/cash-payments.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "app-edit-cash-payments",
  templateUrl: "./edit-cash-payments.component.html",
  styleUrls: ["./edit-cash-payments.component.scss"]
})
export class EditCashPaymentsComponent implements OnInit {
  private editedRowIndex: number;
  cashPaymentForm: FormGroup;
  cashPaymentDetail: CashPaymentMaster;
  allCash;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();

  // Open the Ledger List Modal on Popup....
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };

  constructor(
    public cashPaymentService: CashPaymentsService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.allCash = this.cashPaymentService.getCashPayment();
    this.cashPaymentService.init();
    this.buildEditCashPaymentForm(); // initialize the form
  }

  buildEditCashPaymentForm() {
    this.cashPaymentForm = this.fb.group({
      series: [280],
      project: [this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : ""],
      voucherNo: [
        this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : ""
      ],
      cashAccount: [
        this.cashPaymentDetail ? this.cashPaymentDetail.LedgerID : ""
      ],
      cashParty: "",
      date: [this.cashPaymentDetail ? this.cashPaymentDetail.CreatedDate : ""],
      cashPaymentEntryList: this.fb.array([this.addCashPaymentEntryFormGroup()])
    });
  }

  addCashPaymentEntryFormGroup(): FormGroup {
    return this.fb.group({
      ledgerCode: "",
      particularsOraccountingHead: "",
      voucherNo: "",
      amount: "",
      currentBalance: "",
      vType: "",
      remarks: ""
    });
  }

  get getCashPaymentEntryList(): FormArray {
    return <FormArray>this.cashPaymentForm.get("cashPaymentEntryList");
  }

  // Save function goes here....
  public save(): void {
    if (this.cashPaymentForm.valid) {
      this.router.navigate(["/cashPayments"]);
    } else {
    }
  }

  // Cancel function goes here....
  public cancel(): void {
    this.cashPaymentForm.reset();
    this.router.navigate(["/cashPayments"]);
  }

  // Add Handler goes here....
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashPaymentForm.get("cashPaymentEntryList").invalid) return;
    (<FormArray>this.cashPaymentForm.get("cashPaymentEntryList")).push(
      this.addCashPaymentEntryFormGroup()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  // Edit handler goes here....
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashPaymentEntry = <FormArray>(
      this.cashPaymentForm.get("cashPaymentEntryList")
    );
    cashPaymentEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    cashPaymentEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    cashPaymentEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    cashPaymentEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    cashPaymentEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.cashPaymentForm.get("cashPaymentEntryList"));
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    // code goes here ......
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const cashPaymentEntry = <FormArray>(
      this.cashPaymentForm.get("cashPaymentEntryList")
    );
    cashPaymentEntry.removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.FormGroup = undefined;
  }
}
