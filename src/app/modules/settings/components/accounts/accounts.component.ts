import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"]
})
export class AccountsComponent implements OnInit {
  accountsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildAccountsForm();
  }

  buildAccountsForm(): void {
    this.accountsForm = this._fb.group({
      defaultCash: [null],
      negativeCash: [""],
      defaultBank: [null],
      negativeBank: [""],
      creditLimit: [""],
      creditors: [""],
      budgetLimit: [""],
      transaction: [""]
    });
  }
}
