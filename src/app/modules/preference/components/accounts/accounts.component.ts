import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import {
  CashAccountList,
  Preferences,
  BankAccounts,
} from "../../models/preference.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
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

  save(): void {
    this.preferenceService.updatePreference(this.accountFroms.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Account prefrence edited successfully");
        this.buildAccountForms();
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
