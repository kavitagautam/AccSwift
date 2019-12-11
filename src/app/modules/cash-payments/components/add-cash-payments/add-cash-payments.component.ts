import {
  CashReceitptDetails,
  CashPaymentMaster
} from "./../../models/cash-payments.model";
import { ActivatedRoute, Router } from "@angular/router";
import { SortDescriptor } from "@progress/kendo-data-query";
import {
  PageChangeEvent,
  SelectAllCheckboxState
} from "@progress/kendo-angular-grid";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CashPaymentsService } from "./../../services/cash-payments.service";
import {
  SeriesList,
  ProjectList
} from "@app/modules/bank-receipts/models/bank-receipt.model";
@Component({
  selector: "app-add-cash-payments",
  templateUrl: "./add-cash-payments.component.html",
  styleUrls: ["./add-cash-payments.component.scss"]
})
export class AddCashPaymentsComponent implements OnInit {
  addCashPaymentForm: FormGroup;
  seriesList: SeriesList;
  projectList: ProjectList;
  cashPaymentMaster: CashPaymentMaster;
  allCash;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();
  editedRowIndex: any;

  // CONSTRUCTOR goes here....
  constructor(
    public cashPaymentService: CashPaymentsService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.allCash = this.cashPaymentService.getCashPayment();
    this.cashPaymentService.init();
    this.editCashPaymentForm();
    console.log(this.allCash);
  } // ngoninit method ends here...a

  editCashPaymentForm() {
    this.addCashPaymentForm = this.fb.group({
      series: [280],
      project: [this.cashPaymentMaster ? this.cashPaymentMaster.ProjectID : ""],
      voucherNo: [
        this.cashPaymentMaster ? this.cashPaymentMaster.VoucherNo : ""
      ],
      cashAccount: [
        this.cashPaymentMaster ? this.cashPaymentMaster.LedgerID : ""
      ],
      cashParty: "",
      date: [this.cashPaymentMaster ? this.cashPaymentMaster.CreatedDate : ""],
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

  get getcashPaymentEntryList(): FormArray {
    return <FormArray>this.addCashPaymentForm.get("cashPaymentEntryList");
  }

  // Save Funtion goes here....
  public save(): void {
    if (this.addCashPaymentForm.valid) {
      this.router.navigate(["/cashPayments"]);
    }
  }

  // Cancel Funtion goes here....
  public cancel(): void {
    this.addCashPaymentForm.reset();
    this.router.navigate(["/cashPayments"]);
  }

  // Add Handler goes here .............
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addCashPaymentForm.get("cashPaymentEntryList").invalid) return;
    (<FormArray>this.addCashPaymentForm.get("cashPaymentEntryList")).push(
      this.addCashPaymentEntryFormGroup()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  // Edit Handler goes here .............
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashPaymentEntry = <FormArray>(
      this.addCashPaymentForm.get("cashPaymentEntryList")
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
    sender.editRow(
      rowIndex,
      this.addCashPaymentForm.get("cashPaymentEntryList")
    );
  }

  //Cancel Handler goes here....
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }
  // Remove Handler goes here......
  public removeHandler({ dataItem, rowIndex }) {
    (<FormArray>this.addCashPaymentForm.get("cashPaymentEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
