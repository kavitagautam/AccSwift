import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DATE_FORMAT } from "../../models/settings.model";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  settingsForm: FormGroup;
  dateFormats: DATE_FORMAT[];
  dateSampleValue: string;
  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildSettingsForm();
    this.getDateFormat();
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_DATE: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_DATE.Value
          : "",
      ],
      DATE_FORMAT: [
        this.settingsService.settings
          ? this.settingsService.settings.DATE_FORMAT.Value
          : "",
      ],
      DEFAULT_DECIMALPLACES: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_DECIMALPLACES.Value
          : "",
      ],
      COMMA_SEPARATED: [
        this.settingsService.settings
          ? this.settingsService.settings.COMMA_SEPARATED.Value
          : "",
      ],
      DECIMAL_FORMAT: [
        this.settingsService.settings
          ? this.settingsService.settings.DECIMAL_FORMAT.Value
          : "",
      ],
      DEFAULT_LANGUAGE: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_LANGUAGE.Value
          : "",
      ],
      MULTI_CURRENCY: [
        this.settingsService.settings
          ? this.settingsService.settings.MULTI_CURRENCY.Value
          : "",
      ],
      VAT: [
        this.settingsService.settings
          ? this.settingsService.settings.VAT.Value
          : "",
      ],
      PL_AMOUNT: [
        this.settingsService.settings
          ? this.settingsService.settings.PL_AMOUNT.Value
          : "",
      ],
    });
  }

  dateFormatChange(value): void {
    if (this.dateFormats && this.dateFormats.length > 0) {
      const dateFormat = this.dateFormats.filter((date) => date.ID === value);
      this.dateSampleValue = formatDate(
        "2020-02-20",
        dateFormat[0].Format,
        "en_US"
      );
    }
  }

  getDateFormat(): void {
    this.settingsService.getDateFormats().subscribe((response) => {
      this.dateFormats = response.Entity;
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
