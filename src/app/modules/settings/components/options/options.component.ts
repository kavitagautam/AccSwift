import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DATE_FORMAT, Settings } from "../../models/settings.model";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  settingsForm: FormGroup;
  dateFormats: DATE_FORMAT[];
  dateSampleValue: string;

  settings: Settings;
  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildSettingsForm();
    this.getDateFormat();
    this.getSettings();
  }

  getSettings(): void {
    this.settingsService.getSettingsData().subscribe((response) => {
      this.settings = response.Entity;
      this.buildSettingsForm();
    });
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_DATE: [this.settings ? this.settings.DEFAULT_DATE.Value : ""],
      DATE_FORMAT: [this.settings ? this.settings.DATE_FORMAT.Value : ""],
      DEFAULT_DECIMALPLACES: [
        this.settings ? this.settings.DEFAULT_DECIMALPLACES.Value : null,
      ],
      COMMA_SEPARATED: [
        this.settings ? this.settings.COMMA_SEPARATED.Value : "",
      ],
      DECIMAL_FORMAT: [this.settings ? this.settings.DECIMAL_FORMAT.Value : ""],
      DEFAULT_LANGUAGE: [
        this.settings ? this.settings.DEFAULT_LANGUAGE.Value : "",
      ],
      MULTI_CURRENCY: [this.settings ? this.settings.MULTI_CURRENCY.Value : ""],
      VAT: [this.settings ? this.settings.VAT.Value : ""],
      PL_AMOUNT: [this.settings ? this.settings.PL_AMOUNT.Value : ""],
    });
    this.dateFormatChange(this.settingsForm.get("DATE_FORMAT").value);
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Account settings edited successfully");
        this.getSettings();
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/settings"]);
  }
}
