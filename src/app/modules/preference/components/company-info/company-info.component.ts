import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "accSwift-company-info",
  templateUrl: "./company-info.component.html",
  styleUrls: ["./company-info.component.scss"]
})
export class CompanyInfoComponent implements OnInit {
  companyForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildCompanyForm();
  }

  buildCompanyForm(): void {
    this.companyForm = this._fb.group({
      companyName: [""],
      companyAddress: [""],
      companyCity: [""],
      companyPan: [""],
      companyPhone: [""],
      companySlogan: [""]
    });
  }
}
