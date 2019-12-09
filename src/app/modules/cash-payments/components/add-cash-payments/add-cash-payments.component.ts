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
  date: Date = new Date();
  constructor(
    public cashPaymentService: CashPaymentsService,
    private fb: FormBuilder
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
}
