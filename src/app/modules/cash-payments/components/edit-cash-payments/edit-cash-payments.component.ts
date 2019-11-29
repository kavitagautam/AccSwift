import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CashReceiptMaster, LedgerList } from "./../../../cash-receipts/models/cash-receipt.model";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CashPaymentsService } from "../../Services/cash-payments.service";
import { NumberValueAccessor } from "@angular/forms/src/directives";

@Component({
  selector: "app-edit-cash-payments",
  templateUrl: "./edit-cash-payments.component.html",
  styleUrls: ["./edit-cash-payments.component.scss"]
})
export class EditCashPaymentsComponent implements OnInit {
  private editedRowIndex: number;
  @ViewChild("ledgerSelectModal") ledgerSelectModal: ElementRef;
  numericFormat: string = "n2";
  public decimals: number = 2;
  data: Date = new Date();
  cashPaymentDetail: CashReceiptMaster;
  editCashPaymentForm: FormGroup;
  submitted: boolean;
  ledgerList: LedgerList[] = [];
  selectedLedgerRow: number;
  ledgerListLoading: boolean;
  rowSubmitted: boolean;

  constructor(public cashPaymentService: CashPaymentsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildCashPaymentForm();
  }

  buildCashPaymentForm(): void {
    this.editCashPaymentForm = this.fb.group({
      series: [this.cashPaymentDetail ? this.cashPaymentDetail.SeriesID : ""],
      project: [this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : ""],
      voucherNo: [this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : ""],
      cashAccount: [""],
      date: [this.cashPaymentDetail ? this.cashPaymentDetail.CashReceiptDate : ""],
      cashPaymentEntryList: this.fb.array([this.addCashPaymentEntryFormGroup()])
    });
  }

  addCashPaymentEntryFormGroup(): FormGroup {
    return this.fb.group({
      particularsOraccoutingHead: ["", Validators.required],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }
}
