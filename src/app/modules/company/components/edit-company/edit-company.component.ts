import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CompanyService } from "../../services/company.service";
import { CompanyList } from "../../models/company.model";
@Component({
  selector: "accSwift-edit-company",
  templateUrl: "./edit-company.component.html",
  styleUrls: ["./edit-company.component.scss"]
})
export class EditCompanyComponent implements OnInit {
  companyDetails: CompanyList;
  editComponyForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public companyService: CompanyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    this.editComponyForm = this._fb.group({
      name: [this.companyDetails ? this.companyDetails.Name : ""],
      code: [this.companyDetails ? this.companyDetails.Code : ""],
      address1: [this.companyDetails ? this.companyDetails.Address1 : ""],
      address2: [this.companyDetails ? this.companyDetails.Address2 : ""],
      city: [this.companyDetails ? this.companyDetails.City : ""],
      district: [this.companyDetails ? this.companyDetails.District : ""],
      zone: [this.companyDetails ? this.companyDetails.Zone : ""],
      telephone: [this.companyDetails ? this.companyDetails.Telephone : ""],
      email: [this.companyDetails ? this.companyDetails.Email : ""],
      website: [this.companyDetails ? this.companyDetails.Website : ""],
      POBoxNo: [this.companyDetails ? this.companyDetails.POBox : ""],
      PANNo: [this.companyDetails ? this.companyDetails.PAN : ""]
    });
  }

  public save(): void {
    if (this.editComponyForm.valid) {
      this.router.navigate(["/company"]);
    } else {
    }
  }

  public cancel(): void {
    this.editComponyForm.reset();
    this.router.navigate(["/company"]);
  }
}
