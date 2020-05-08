import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  SalesAccounts,
  PurchaseAccount,
  AccountClass,
} from "../../models/preference.model";
import { PreferenceService } from "../../services/preference.service";

@Component({
  selector: "accSwift-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
})
export class SalesComponent implements OnInit {
  salesForms: FormGroup;
  salesAccountList: SalesAccounts[];
  purchaseAccountList: PurchaseAccount[];
  accountClassList: AccountClass[];
  constructor(
    private _fb: FormBuilder,
    private prefrenceService: PreferenceService
  ) {}

  ngOnInit() {
    this.buildSalesForm();
    this.prefrenceService.getSalesAccount().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
    this.prefrenceService.getPurchaseAccount().subscribe((response) => {
      this.purchaseAccountList = response.Entity;
    });
    this.prefrenceService.getAccountClass().subscribe((response) => {
      this.accountClassList = response.Entity;
    });
  }

  buildSalesForm(): void {
    this.salesForms = this._fb.group({
      DEFAULT_PURCHASE_ACCOUNT: [
        this.prefrenceService.preferences
          ? this.prefrenceService.preferences.DEFAULT_PURCHASE_ACCOUNT.Value
          : null,
      ],
      DEFAULT_SALES_ACCOUNT: [
        this.prefrenceService.preferences
          ? this.prefrenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      DEFAULT_ACC_CLASS: [
        this.prefrenceService.preferences
          ? this.prefrenceService.preferences.DEFAULT_ACC_CLASS.Value
          : null,
      ],
    });
  }
}
