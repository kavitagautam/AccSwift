import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "../../services/company.service";
import { CompanyList } from "../../models/company.model";
import { RegexConst } from "@app/shared/constants/regex.constant";

@Component({
  selector: "accSwift-edit-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./edit-company.component.scss"]
})
export class EditCompanyComponent implements OnInit {
  companyDetails: CompanyList;
  companyForm: FormGroup;
  regexConst = RegexConst;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public companyService: CompanyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildCompanyForm();
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.companyService
          .getCompanyDetails(params.get("id"))
          .subscribe(res => {
            this.companyDetails = res;
            this.buildCompanyForm();
          });
      }
    });
  }

  buildCompanyForm(): void {
    this.companyForm = this._fb.group({
      companyName: [
        this.companyDetails ? this.companyDetails.Name : "",
        Validators.required
      ],
      code: [
        this.companyDetails ? this.companyDetails.Code : "",
        Validators.required
      ],
      address1: [this.companyDetails ? this.companyDetails.Address1 : ""],
      address2: [this.companyDetails ? this.companyDetails.Address2 : ""],
      city: [this.companyDetails ? this.companyDetails.City : ""],
      district: [this.companyDetails ? this.companyDetails.District : ""],
      zone: [this.companyDetails ? this.companyDetails.Zone : ""],
      telephone: [this.companyDetails ? this.companyDetails.Telephone : ""],
      email: [this.companyDetails ? this.companyDetails.Email : ""],
      website: [this.companyDetails ? this.companyDetails.Website : ""],
      POBoxNo: [this.companyDetails ? this.companyDetails.POBox : ""],
      PANNo: [this.companyDetails ? this.companyDetails.PAN : ""],
      fiscalYear: ["", Validators.pattern(this.regexConst.DATE)],
      fiscalStyle: [""],
      booksBegin: ["", Validators.pattern(this.regexConst.DATE)]
    });
  }

  public save(): void {
    if (this.companyForm.valid) {
      this.router.navigate(["/company"]);
    } else {
    }
  }

  public cancel(): void {
    this.companyForm.reset();
    this.router.navigate(["/company"]);
  }
}
