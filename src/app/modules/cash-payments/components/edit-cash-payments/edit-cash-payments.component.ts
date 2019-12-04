import { CashPaymentsService } from "./../../Services/cash-payments.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SortDescriptor } from "@progress/kendo-data-query";
import {
  PageChangeEvent,
  SelectAllCheckboxState
} from "@progress/kendo-angular-grid";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-edit-cash-payments",
  templateUrl: "./edit-cash-payments.component.html",
  styleUrls: ["./edit-cash-payments.component.scss"]
})
export class EditCashPaymentsComponent implements OnInit {
  @ViewChild("ledgerSelectModal") ledgerSelectModal: ElementRef;
  private editedRowIndex: number;

  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  cashPaymentDetail;
  editCashPaymentForm: FormGroup;
  submitted: boolean;
  ledgerList = [];
  selectedLedgerRow: number;
  ledgerListLoading: boolean;
  rowSubmitted: boolean;
  getId;
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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildCashPaymentForm();
    this.cashPaymentService.init();

    this.route.paramMap.subscribe(params => {
      this.getId = +params.get("id");
      if (this.getId) {
        this.cashPaymentService
          .getCashPaymentDetails(this.getId)
          .subscribe(res => {
            this.cashPaymentDetail = res;
            this.buildCashPaymentForm();
            // this.setCashPaymentList();
          });
      }
    });
  } // ngoninit method ends here...a

  setCashPaymentList() {
    this.editCashPaymentForm.setControl(
      "cashPaymentEntryList",
      this.setCashPaymentFormArray(this.cashPaymentDetail)
    );
  }

  setCashPaymentFormArray(cashPaymentDetails): FormArray {
    const cashPaymentFormArray = new FormArray([]);
    if (cashPaymentDetails && cashPaymentDetails.length > 0) {
      cashPaymentDetails.array.forEach(element => {
        cashPaymentDetails.push(
          this.fb.group({
            particularsOraccoutingHead: [
              element.ledger_name,
              Validators.required
            ],
            voucherNo: [element.voucherNo],
            currentBalance: element.TotalAmount,
            vType: element.VoucherType,
            remarks: element.Remarks
          })
        );
      });
    } else {
      cashPaymentFormArray.push(
        this.fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""]
        })
      );
    }
    return cashPaymentFormArray;
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

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.editCashPaymentForm.get("cashReceiptEntryList").invalid) return;

    (<FormArray>this.editCashPaymentForm.get("cashReceiptEntryList")).push(
      this.addCashPaymentEntryFormGroup()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.editCashPaymentForm.valid) {
      this.router.navigate(["/cash"]);
    } else {
    }
  }

  public cancel(): void {
    this.editCashPaymentForm.reset();
    this.router.navigate(["/cash"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editCashPaymentForm.get("cashReceiptEntryList").invalid) return;
    (<FormArray>this.editCashPaymentForm.get("cashReceiptEntryList")).push(
      this.addCashPaymentEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashRecieptEntry = <FormArray>(
      this.editCashPaymentForm.get("cashReceiptEntryList")
    );
    cashRecieptEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    cashRecieptEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    cashRecieptEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    cashRecieptEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    cashRecieptEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editCashPaymentForm.get("cashReceiptEntryList")
    );
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
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

  // select ledger column
  selectedLedger(item, selectedRow): void {
    const cashReceiptEntry = <FormArray>(
      this.editCashPaymentForm.get("cashReceiptEntryList")
    );
    cashReceiptEntry.controls[selectedRow]
      .get("currentBalance")
      .setValue(item.currentAmount);
    cashReceiptEntry.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(item.LedgerName);
    cashReceiptEntry.controls[selectedRow]
      .get("amount")
      .setValue(item.ActualBalance);
    this.ledgerSelectModal.nativeElement.click();
  }

  //Selected the Ledger row
  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.ledgerList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    const selected = this.ledgerList.filter(function(obj) {
      return obj.LedgerID == e[0];
    });

    const cashReceiptFormArray = <FormArray>(
      this.editCashPaymentForm.get("cashReceiptEntryList")
    );
    cashReceiptFormArray.controls[selectedRow]
      .get("balance")
      .setValue(selected[0].ActualBalance);
    cashReceiptFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(selected[0].LedgerName);
    this.ledgerSelectModal.nativeElement.click();
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
    const cashRecieptEntry = <FormArray>(
      this.editCashPaymentForm.get("cashReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.editCashPaymentForm.get("cashReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
