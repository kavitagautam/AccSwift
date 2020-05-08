import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import {
  SalesAccounts,
  PurchaseAccount,
  AccountClass,
} from "../../models/preference.model";

@Component({
  selector: "accSwift-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  settingForms: FormGroup;
  salesAccountList: SalesAccounts[];
  purchaseAccountList: PurchaseAccount[];
  accountClassList: AccountClass[];
  constructor(
    private _fb: FormBuilder,
    private prefrenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildSettingsForm();
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

  buildSettingsForm(): void {
    this.settingForms = this._fb.group({
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
