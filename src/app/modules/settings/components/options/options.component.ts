import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})
export class OptionsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildSettingsForm();
  }

  public dateFormat = [
    { id: 1, format: "yyyy-MM-dd" },
    { id: 2, format: "dd-MM-yyyy" },
    { id: 3, format: "MM-dd-yyyy" }
  ];

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      date: [""],
      format: [""],
      sample: [""],
      decimalPlace: [""],
      comma: [""],
      decimal: [""],
      defaultLanguage: [""],
      multiCurrency: [""],
      VAT: [""],
      amount: [""]
    });
  }

  changeFormat(value): void {
    console.log(value);
    this.settingsForm
      .get("sample")
      .setValue(formatDate("2020-02-20", value, "en_US"));
  }
}
