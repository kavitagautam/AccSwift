import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-company-info",
  templateUrl: "./company-info.component.html",
  styleUrls: ["./company-info.component.scss"],
})
export class CompanyInfoComponent implements OnInit {
  companyForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildCompanyForm();
  }

  buildCompanyForm(): void {
    this.companyForm = this._fb.group({
      COMPANY_NAME: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_NAME.Value
          : "",
      ],
      COMPANY_ADDRESS: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_ADDRESS.Value
          : "",
      ],
      COMPANY_CITY: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_CITY.Value
          : "",
      ],
      COMPANY_PAN: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_PAN.Value
          : "",
      ],
      COMPANY_PHONE: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_PHONE.Value
          : "",
      ],
      COMPANY_SLOGAN: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.COMPANY_SLOGAN.Value
          : "",
      ],
    });
  }

  save(): void {
    this.preferenceService.updatePreference(this.companyForm.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Option prefrence edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
