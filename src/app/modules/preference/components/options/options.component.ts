import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";

@Component({
  selector: "accSwift-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"]
})
export class OptionsComponent implements OnInit {
  optionForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildOptionForm();
  }

  public sampleFormat = [
    { id: 1, format: "yyyy-MM-dd" },
    { id: 2, format: "dd-MM-yyyy" },
    { id: 3, format: "MM-dd-yyyy" }
  ];

  buildOptionForm() {
    this.optionForm = this._fb.group({
      date: [""],
      dateFormat: [null],
      sample: [""],
      decimalPlace: [null],
      comma: [""],
      decimal: [""],
      mailServer: [""],
      serverPort: [""],
      email: [""],
      password: [""]
    });
  }

  dateFormatChange(value): void {
    console.log(value);
    this.optionForm
      .get("sample")
      .setValue(formatDate("2020-02-20", value, "en_US"));
  }
}
