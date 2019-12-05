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
@Component({
  selector: "app-edit-cash-payments",
  templateUrl: "./edit-cash-payments.component.html",
  styleUrls: ["./edit-cash-payments.component.scss"]
})
export class EditCashPaymentsComponent implements OnInit {
  cashPaymentForm: FormGroup;
  cashPaymentMaster: CashPaymentMaster;

  constructor(
    public cashPaymentService: CashPaymentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.allCash = this.cashPaymentService.getCashPayment();
    console.log(this.allCash);
  } // ngoninit method ends here...a

  editCashPaymentForm() {
    this.cashPaymentForm = this.fb.group({});
  }
}
