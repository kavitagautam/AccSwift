import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-defaults",
  templateUrl: "./defaults.component.html",
  styleUrls: ["./defaults.component.scss"]
})
export class DefaultsComponent implements OnInit {
  defaultsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildDefaultsForm();
  }

  buildDefaultsForm(): void {
    this.defaultsForm = this._fb.group({
      mailServer: [""],
      serverPort: [""],
      userEmail: [""],
      password: [""],
      prepared: [""],
      checked: [""],
      approved: [""],
      capital: [""],
      issuedCapital: [""]
    });
  }
}
