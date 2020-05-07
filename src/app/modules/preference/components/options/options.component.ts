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
  dateFormat: string;
  preferenceList;
  constructor(
    private _fb: FormBuilder,
    public preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildOptionForm();

    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceList = response.Entity;
      this.buildOptionForm();
    });
  }

  public sampleFormat = [
    { id: 1, format: "YYYY/MM/DD" },
    { id: 2, format: "dd-MM-yyyy" },
    { id: 3, format: "MM-dd-yyyy" },
  ];

  buildOptionForm(): void {
    this.optionForm = this._fb.group({
      date: [this.preferenceList ? this.preferenceList.DEFAULT_DATE.Value : ""],
      dateFormat: [
        this.preferenceList ? this.preferenceList.DATE_FORMAT.Value : "",
      ],
      sample: [""],
      decimalPlace: [
        this.preferenceList
          ? this.preferenceList.DEFAULT_DECIMALPLACES.Value
          : "",
      ],
      comma: [
        this.preferenceList ? this.preferenceList.COMMA_SEPARATED.Value : "",
      ],
      decimal: [
        this.preferenceList ? this.preferenceList.DECIMAL_FORMAT.Value : "",
      ],
      mailServer: [""],
      serverPort: [""],
      email: [""],
      password: [""],
    });
  }

  dateFormatChange(value): void {
    console.log("Format Value");
    this.optionForm
      .get("sample")
      .setValue(formatDate("2020-02-20", value, "en_US"));
  }
}
