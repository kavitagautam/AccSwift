import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-defaults",
  templateUrl: "./defaults.component.html",
  styleUrls: ["./defaults.component.scss"],
})
export class DefaultsComponent implements OnInit {
  defaultsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildDefaultsForm();
  }

  buildDefaultsForm(): void {
    this.defaultsForm = this._fb.group({
      MAIL_SERVER: [
        this.settingsService.settings
          ? this.settingsService.settings.MAIL_SERVER.Value
          : "",
      ],
      SERVER_PORT: [
        this.settingsService.settings
          ? this.settingsService.settings.SERVER_PORT.Value
          : "",
      ],
      USER_EMAIL: [
        this.settingsService.settings
          ? this.settingsService.settings.USER_EMAIL.Value
          : "",
      ],
      PASSWORD: [
        this.settingsService.settings
          ? this.settingsService.settings.PASSWORD.Value
          : "",
      ],
      PREPARED_BY: [
        this.settingsService.settings
          ? this.settingsService.settings.PREPARED_BY.Value
          : "",
      ],
      CHECKED_BY: [
        this.settingsService.settings
          ? this.settingsService.settings.CHECKED_BY.Value
          : "",
      ],
      APPROVED_BY: [
        this.settingsService.settings
          ? this.settingsService.settings.APPROVED_BY.Value
          : "",
      ],
      AUTHORISED_CAPITAL: [
        this.settingsService.settings
          ? this.settingsService.settings.AUTHORISED_CAPITAL.Value
          : "",
      ],
      ISSUED_CAPITAL: [
        this.settingsService.settings
          ? this.settingsService.settings.ISSUED_CAPITAL.Value
          : "",
      ],
    });
  }

  save(): void {
    this.settingsService.updateSettings(this.defaultsForm.value).subscribe(
      (response) => {
        this.router.navigate(["/settings"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Default settings edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/settings"]);
  }
}
