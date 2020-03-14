import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

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

  buildOptionForm() {
    this.optionForm = this._fb.group({
      date: [""],
      dateFormat: [""],
      sample: [""],
      decimalPlace: [""],
      comma: [""],
      decimal: [""],
      mailServer: [""],
      serverPort: [""],
      email: [""],
      password: [""]
    });
  }
}
