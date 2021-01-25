import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import { PurchaseAccount } from "../../models/preference.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SalesAccounts } from "@accSwift-modules/accswift-shared/models/sales-account.model";
import { AccountClass } from "@accSwift-modules/accswift-shared/models/account-class.model";
import { Depot } from "@accSwift-modules/depot/models/depot.model";
import { Project } from "@accSwift-modules/accswift-shared/models/project.model";

@Component({
  selector: "accSwift-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  settingForms: FormGroup;
  salesAccountList: SalesAccounts[];
  purchaseAccountList: PurchaseAccount[];
  accountClassList: AccountClass[] = [];

  depotList: Depot[] = [];
  projectList: Project[] = [];

  constructor(
    private _fb: FormBuilder,
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildSettingsForm();
    this.preferenceService.getSalesAccount().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
    this.preferenceService.getPurchaseAccount().subscribe((response) => {
      this.purchaseAccountList = response.Entity;
    });
    this.preferenceService.getAccountClass().subscribe((response) => {
      this.accountClassList = response.Entity;
    });
    this.getDepotList();
    this.getProjectLists();
  }

  buildSettingsForm(): void {
    this.settingForms = this._fb.group({
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
      DEFAULT_PROJECT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
      ],
      DEFAULT_DEPOT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
          : null,
      ],
    });
  }
  save(): void {
    this.preferenceService.updatePreference(this.settingForms.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Option prefrence edited successfully");
        this.buildSettingsForm();
      }
    );
  }

  getDepotList(): void {
    this.preferenceService.getDepotDD().subscribe((response) => {
      this.depotList = response.Entity;
    });
  }

  getProjectLists(): void {
    this.preferenceService.getProjectDD().subscribe((response) => {
      this.projectList = response.Entity;
    });
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
