import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { RegexConst } from "@app/shared/constants/regex.constant";

@Component({
  selector: "accSwift-add-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./add-company.component.scss"]
})
export class AddCompanyComponent implements OnInit {
  companyForm: FormGroup;
  regexConst = RegexConst;

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
    this.companyForm = this._fb.group({
      companyName: ["", Validators.required],
      code: ["", Validators.required],
      address1: [""],
      address2: [""],
      city: [""],
      district: [""],
      zone: [""],
      telephone: [""],
      email: [""],
      website: [" "],
      POBoxNo: [""],
      PANNo: [""],
      fiscalYear: ["", Validators.pattern(this.regexConst.DATE)],
      fiscalStyle: [""],
      booksBegin: ["", Validators.pattern(this.regexConst.DATE)]
    });
  }

  public save(): void {
    if (this.companyForm.valid) {
      this.companyService.addCompany(this.companyForm.value).subscribe(
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
    this.companyForm.reset();
    this.router.navigate(["/company"]);
  }
}
