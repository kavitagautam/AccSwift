import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { SettingsService } from "../../services/settings.service";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  settingsForm: FormGroup;
  dateFormatValue: string;
  constructor(
    private _fb: FormBuilder,
    private settingServices: SettingsService
  ) {}

  ngOnInit(): void {
    this.buildSettingsForm();
  }

  public dateFormat = [
    { id: 1, format: "yyyy-MM-dd" },
    { id: 2, format: "dd-MM-yyyy" },
    { id: 3, format: "MM-dd-yyyy" },
  ];

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_DATE: [
        this.settingServices.settings
          ? this.settingServices.settings.DEFAULT_DATE.Value
          : "",
      ],
      DATE_FORMAT: [
        this.settingServices.settings
          ? this.settingServices.settings.DATE_FORMAT.Value
          : "",
      ],
      DEFAULT_DECIMALPLACES: [
        this.settingServices.settings
          ? this.settingServices.settings.DEFAULT_DECIMALPLACES.Value
          : "",
      ],
      COMMA_SEPARATED: [
        this.settingServices.settings
          ? this.settingServices.settings.COMMA_SEPARATED.Value
          : "",
      ],
      DECIMAL_FORMAT: [
        this.settingServices.settings
          ? this.settingServices.settings.DECIMAL_FORMAT.Value
          : "",
      ],
      DEFAULT_LANGUAGE: [
        this.settingServices.settings
          ? this.settingServices.settings.DEFAULT_LANGUAGE.Value
          : "",
      ],
      MULTI_CURRENCY: [
        this.settingServices.settings
          ? this.settingServices.settings.MULTI_CURRENCY.Value
          : "",
      ],
      VAT: [
        this.settingServices.settings
          ? this.settingServices.settings.VAT.Value
          : "",
      ],
      PL_AMOUNT: [
        this.settingServices.settings
          ? this.settingServices.settings.PL_AMOUNT.Value
          : "",
      ],
    });
  }

  changeFormat(value): void {
    this.dateFormatValue = formatDate("2020-02-20", value, "en_US");
  }
}
