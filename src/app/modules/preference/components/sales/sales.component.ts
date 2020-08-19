import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PurchaseAccount } from "../../models/preference.model";
import { PreferenceService } from "../../services/preference.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SalesAccounts } from "@accSwift-modules/accswift-shared/models/sales-account.model";
import { AccountClass } from "@accSwift-modules/accswift-shared/models/account-class.model";

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
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildSalesForm();
    this.preferenceService.getSalesAccount().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
    this.preferenceService.getPurchaseAccount().subscribe((response) => {
      this.purchaseAccountList = response.Entity;
    });
    this.preferenceService.getAccountClass().subscribe((response) => {
      this.accountClassList = response.Entity;
    });
  }

  buildSalesForm(): void {
    this.salesForms = this._fb.group({
      DEFAULT_PURCHASE_ACCOUNT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PURCHASE_ACCOUNT.Value
          : null,
      ],
      DEFAULT_SALES_ACCOUNT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      DEFAULT_ACC_CLASS: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_ACC_CLASS.Value
          : null,
      ],
    });
  }
  save(): void {
    this.preferenceService.updatePreference(this.salesForms.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Option prefrence edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
