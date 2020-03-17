import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"]
})
export class SettingComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildSettingsForm();
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      purchase: [null],
      salesReceipt: [null],
      salesAccount: [null],
      negativeStock: [""]
    });
  }
}
