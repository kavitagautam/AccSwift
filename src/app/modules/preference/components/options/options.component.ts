import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { PreferenceService } from "../../services/preference.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { DATE_FORMAT, Preferences } from "../../models/preference.model";
import { Subscription } from "rxjs";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  optionForm: FormGroup;
  dateFormats: DATE_FORMAT[];
  dateSampleValue: string;
  subscription: Subscription;
  preferenceData: Preferences;
  constructor(
    private _fb: FormBuilder,
    public preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPreferences();
    this.getDateFormat();
    this.buildOptionForm();
  }

  getPreferences(): void {
    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceData = response.Entity;
      this.buildOptionForm();
    });
  }

  buildOptionForm(): void {
    this.optionForm = this._fb.group({
      DEFAULT_DATE: [
        this.preferenceData ? this.preferenceData.DEFAULT_DATE.Value : "",
      ],
      DATE_FORMAT: [
        this.preferenceData ? this.preferenceData.DATE_FORMAT.Value : "",
      ],
      DEFAULT_DECIMALPLACES: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_DECIMALPLACES.Value
          : null,
      ],
      COMMA_SEPARATED: [
        this.preferenceData ? this.preferenceData.COMMA_SEPARATED.Value : "",
      ],
      DECIMAL_FORMAT: [
        this.preferenceData ? this.preferenceData.DECIMAL_FORMAT.Value : "",
      ],
      MAIL_SERVER: [
        this.preferenceData ? this.preferenceData.MAIL_SERVER.Value : "",
      ],
      PASSWORD: [this.preferenceData ? this.preferenceData.PASSWORD.Value : ""],
      SERVER_PORT: [
        this.preferenceData ? this.preferenceData.SERVER_PORT.Value : "",
      ],
      USER_EMAIL: [
        this.preferenceData ? this.preferenceData.USER_EMAIL.Value : "",
      ],
    });
    this.dateFormatChange(this.optionForm.get("DATE_FORMAT").value);
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
    this.preferenceService.getDateFormats().subscribe((response) => {
      this.dateFormats = response.Entity;
    });
  }

  save(): void {
    this.preferenceService.updatePreference(this.optionForm.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Option prefrence edited successfully");
        this.getPreferences();
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
