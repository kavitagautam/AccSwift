import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { PreferenceService } from "../../services/preference.service";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent implements OnInit {
  optionForm: FormGroup;

  dateSampleValue: string;
  constructor(
    private _fb: FormBuilder,
    public preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildOptionForm();
  }

  public sampleFormat = [
    { id: 1, format: "yyyy/MM/dd" },
    { id: 2, format: "dd/MM/yyyy" },
    { id: 3, format: "MM/dd/yyyy" },
  ];

  buildOptionForm(): void {
    this.optionForm = this._fb.group({
      DEFAULT_DATE: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DATE.Value
          : "",
      ],
      DATE_FORMAT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DATE_FORMAT.Value
          : "",
      ],
      DEFAULT_DECIMALPLACES: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DECIMALPLACES.Value
          : "",
      ],
      COMMA_SEPARATED: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMMA_SEPARATED.Value
          : "",
      ],
      DECIMAL_FORMAT: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DECIMAL_FORMAT.Value
          : "",
      ],
      mailServer: [""],
      serverPort: [""],
      email: [""],
      password: [""],
    });

    this.dateFormatChange(this.optionForm.get("DATE_FORMAT").value);
  }

  dateFormatChange(value): void {
    this.dateSampleValue = formatDate("2020-02-20", value, "en_US");
  }
}
