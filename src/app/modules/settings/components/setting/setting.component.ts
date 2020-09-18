import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SalesAccounts } from "@accSwift-modules/accswift-shared/models/sales-account.model";
import { PurchaseAccounts } from "@accSwift-modules/accswift-shared/models/purchase-account.model";

@Component({
  selector: "accSwift-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  settingsForm: FormGroup;
  salesAccountList: SalesAccounts[];
  purchaseAccountList: PurchaseAccounts[];
  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.settingsService.getSalesAccount().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
    this.settingsService.getPurchaseAccount().subscribe((response) => {
      this.purchaseAccountList = response.Entity;
    });
    this.buildSettingsForm();
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_PURCHASE_ACCOUNT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_ACCOUNT.Value
          : null,
      ],
      SALES_REPORT_TYPE: [
        this.settingsService.settings
          ? this.settingsService.settings.SALES_REPORT_TYPE.Value
          : null,
      ],
      DEFAULT_SALES_ACCOUNT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      DEFAULT_NEGATIVESTOCK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_NEGATIVESTOCK.Value
          : "",
      ],
    });
  }

  save(): void {
    this.settingsService.updateSettings(this.settingsForm.value).subscribe(
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
