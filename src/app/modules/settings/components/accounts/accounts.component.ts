import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { BankAccounts, CashAccountList } from "../../models/settings.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCashAccount();
    this.getBankAccount();
    this.buildAccountsForm();
  }

  buildAccountsForm(): void {
    this.accountsForm = this._fb.group({
      DEFAULT_CASH_ACCOUNT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_CASH_ACCOUNT.Value
          : null,
      ],
      DEFAULT_NEGATIVECASH: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_NEGATIVECASH.Value
          : false,
      ],
      DEFAULT_BANK_ACCOUNT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_BANK_ACCOUNT.Value
          : false,
      ],
      DEFAULT_NEGATIVEBANK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_NEGATIVEBANK.Value
          : false,
      ],
      CREDIT_LIMIT: [
        this.settingsService.settings
          ? this.settingsService.settings.CREDIT_LIMIT.Value
          : false,
      ],
      creditors: [""],
      DEFAULT_BUDGET_LIMIT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_BUDGET_LIMIT.Value
          : false,
      ],
      POST_DATE_TRANSACTION: [
        this.settingsService.settings
          ? this.settingsService.settings.POST_DATE_TRANSACTION.Value
          : false,
      ],
    });
  }

  getCashAccount(): void {
    this.settingsService.getCashReceiptAccounts().subscribe((response) => {
      this.cashAccountLists = response.Entity;
    });
  }

  getBankAccount(): void {
    this.settingsService.getBankReceiptAccounts().subscribe((response) => {
      this.bankAccountLists = response.Entity;
    });
  }

  save(): void {
    this.settingsService.updateSettings(this.accountsForm.value).subscribe(
      (response) => {
        this.router.navigate(["/settings"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Account settings edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/settings"]);
  }
}
