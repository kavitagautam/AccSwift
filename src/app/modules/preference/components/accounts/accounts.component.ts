import { Component, OnInit } from "@angular/core";
import { FormGroupName, FormGroup, FormBuilder } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import {
  CashAccountList,
  Preferences,
  BankAccounts,
} from "../../models/preference.model";

@Component({
  selector: "accSwift-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"],
})
export class AccountsComponent implements OnInit {
  accountFroms: FormGroup;
  preferenceList: Preferences;
  cashAccountLists: CashAccountList[];
  bankAccountLists: BankAccounts[];
  constructor(
    private _fb: FormBuilder,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.getCashAccount();
    this.getBankAccount();
    this.buildAccountForms();
    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceList = response.Entity;
      this.buildAccountForms();
    });
  }

  getCashAccount(): void {
    this.preferenceService.getCashReceiptAccounts().subscribe((response) => {
      this.cashAccountLists = response.Entity;
      console.log(JSON.stringify(this.cashAccountLists));
    });
  }

  getBankAccount(): void {
    this.preferenceService.getBankReceiptAccounts().subscribe((response) => {
      this.bankAccountLists = response.Entity;
    });
  }

  buildAccountForms(): void {
    this.accountFroms = this._fb.group({
      DEFAULT_CASH_ACCOUNT: [
        this.preferenceList
          ? this.preferenceList.DEFAULT_CASH_ACCOUNT.Value
          : null,
      ],
      DEFAULT_BANK_ACCOUNT: [
        this.preferenceList
          ? this.preferenceList.DEFAULT_BANK_ACCOUNT.Value
          : null,
      ],
    });
  }
}
