import { SortDescriptor } from "@progress/kendo-data-query";
import { CashReceiptService } from "./../../../cash-receipts/services/cash-receipt.service";
import {
  PageChangeEvent,
  SelectAllCheckboxState
} from "@progress/kendo-angular-grid";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import {
  CashReceiptMaster,
  LedgerList
} from "./../../../cash-receipts/models/cash-receipt.model";
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
  date: Date = new Date();
  cashPaymentDetail: CashReceiptMaster;
  editCashPaymentForm: FormGroup;
  submitted: boolean;
  ledgerList: LedgerList[] = [];
  selectedLedgerRow: number;
  ledgerListLoading: boolean;
  rowSubmitted: boolean;
  //Kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
  ];

  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select
  constructor(
    public cashPaymentService: CashPaymentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildCashPaymentForm();
  }

  buildCashPaymentForm(): void {
    this.editCashPaymentForm = this.fb.group({
      series: [this.cashPaymentDetail ? this.cashPaymentDetail.SeriesID : ""],
      project: [this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : ""],
      voucherNo: [
        this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : ""
      ],
      cashAccount: [""],
      date: [
        this.cashPaymentDetail ? this.cashPaymentDetail.CashReceiptDate : ""
      ],
      cashPaymentEntryList: this.fb.array([this.addCashPaymentEntryFormGroup()])
    });
  }
  get cashPaymentEntryList(): FormArray {
    return <FormArray>this.editCashPaymentForm.get("cashPaymentEntryList");
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

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }

  openModal(index: number): void {
    this.mySelection = [];
    this.selectedLedgerRow = index;
    this.getLedgerList();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.cashPaymentService.getLedgerList().subscribe(
      res => {
        this.ledgerList = res;
      },
      error => {
        this.ledgerListLoading = false;
      },
      () => {
        this.ledgerListLoading = false;
      }
    );
  }
}
