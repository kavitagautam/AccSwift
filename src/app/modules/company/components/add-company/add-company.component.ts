import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "accSwift-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"]
})
export class AddCompanyComponent implements OnInit {
  addCompanyForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrMessageService
  ) {}

  ngOnInit() {
    this.buildCompanyForm();
  }

  buildCompanyForm(): void {
    this.addCompanyForm = this._fb.group({
      name: [""],
      code: [""],
      address1: [""],
      address2: [""],
      city: [""],
      district: [""],
      zone: [""],
      telephone: [""],
      email: [""],
      website: [" "],
      POBoxNo: [""],
      PANNo: []
    });
  }

  public addCompany(): void {
    if (this.addCompanyForm.valid) {
      this.companyService.addCompany(this.addCompanyForm.value).subscribe(
        response => {
          if (response && response.status) {
            this.toastr.showSuccess(response.data);
            return;
          }
          this.toastr.showError(response.data);
        },
        error => {
          this.toastr.showError(error);
        },
        () => {}
      );

      this.router.navigate(["/company"]);
    } else {
    }
  }

  public cancel(): void {
    this.addCompanyForm.reset();
    this.router.navigate(["/company"]);
  }
}
