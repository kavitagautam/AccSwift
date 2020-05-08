import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { BankAccounts, CashAccountList } from "../../models/settings.model";

@Component({
  selector: "accSwift-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"],
})
export class AccountsComponent implements OnInit {
  accountsForm: FormGroup;
  cashAccountLists: CashAccountList[];
  bankAccountLists: BankAccounts[];
  constructor(
    private _fb: FormBuilder,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    this.getCashAccount();
    this.getBankAccount();
    this.buildAccountsForm();
  }

  buildAccountsForm(): void {
    this.accountsForm = this._fb.group({
      DEFAULT_CASH_ACCOUNT: [
        this.settingService.settings
          ? this.settingService.settings.DEFAULT_CASH_ACCOUNT.Value
          : null,
      ],
      DEFAULT_NEGATIVECASH: [
        this.settingService.settings
          ? this.settingService.settings.DEFAULT_NEGATIVECASH.Value
          : false,
      ],
      DEFAULT_BANK_ACCOUNT: [
        this.settingService.settings
          ? this.settingService.settings.DEFAULT_BANK_ACCOUNT.Value
          : false,
      ],
      DEFAULT_NEGATIVEBANK: [
        this.settingService.settings
          ? this.settingService.settings.DEFAULT_NEGATIVEBANK.Value
          : false,
      ],
      CREDIT_LIMIT: [
        this.settingService.settings
          ? this.settingService.settings.CREDIT_LIMIT.Value
          : false,
      ],
      creditors: [""],
      DEFAULT_BUDGET_LIMIT: [
        this.settingService.settings
          ? this.settingService.settings.DEFAULT_BUDGET_LIMIT.Value
          : false,
      ],
      POST_DATE_TRANSACTION: [
        this.settingService.settings
          ? this.settingService.settings.POST_DATE_TRANSACTION.Value
          : false,
      ],
    });
  }

  getCashAccount(): void {
    this.settingService.getCashReceiptAccounts().subscribe((response) => {
      this.cashAccountLists = response.Entity;
    });
  }

  getBankAccount(): void {
    this.settingService.getBankReceiptAccounts().subscribe((response) => {
      this.bankAccountLists = response.Entity;
    });
  }
}
