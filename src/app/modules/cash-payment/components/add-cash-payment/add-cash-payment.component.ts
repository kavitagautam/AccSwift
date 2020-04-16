import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CashPaymentService } from "../../services/cash-payment.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accSwift-add-cash-payment",
  templateUrl: "../common-html/common-cash-payment.html",
  styleUrls: ["./add-cash-payment.component.scss"],
})
export class AddCashPaymentComponent implements OnInit {
  cashPaymentForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();
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
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildCashPaymentForm(); // initialize the form
  }

  buildCashPaymentForm(): void {
    this.cashPaymentForm = this.fb.group({
      seriesId: [null],
      projectId: [null],
      voucherNo: ["", [Validators.required]],
      cashPartyId: [null, [Validators.required]],
      cashAccountId: [null, [Validators.required]],
      date: [new Date()],
      cashPaymentEntryList: this.fb.array([this.addCashPaymentEntryList()]),
    });
  }

  addCashPaymentEntryList(): FormGroup {
    return this.fb.group({
      ledgerCode: "",
      particularsOraccountingHead: "",
      voucherNo: "",
      amount: "",
      currentBalance: "",
      vType: "",
      remarks: "",
    });
  }

  get getCashPaymentEntryList(): FormArray {
    const cashPaymentFormArray = <FormArray>(
      this.cashPaymentForm.get("cashPaymentEntryList")
    );
    return cashPaymentFormArray;
  }

  public save(): void {
    if (this.cashPaymentForm.valid) {
      this.router.navigate(["/cash-payment"]);
    }
  }

  public cancel(): void {
    this.cashPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    this.modalRef.content = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const cashPaymentFormArray = <FormArray>(
          this.cashPaymentForm.get("cashPaymentEntryList")
        );
        cashPaymentFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        cashPaymentFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashPaymentForm.get("cashPaymentEntryList").invalid) return;
    (<FormArray>this.cashPaymentForm.get("cashPaymentEntryList")).push(
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

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }) {
    (<FormArray>this.cashPaymentForm.get("cashPaymentEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
