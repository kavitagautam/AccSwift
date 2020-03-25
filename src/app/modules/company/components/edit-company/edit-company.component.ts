import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "../../services/company.service";
import { CompanyList } from "../../models/company.model";
import { ToastrService } from "ngx-toastr";
import { SelectEvent } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-edit-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./edit-company.component.scss"]
})
export class EditCompanyComponent implements OnInit {
  companyLogo: any = "";
  companyDetails: CompanyList;
  companyForm: FormGroup;

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    public companyService: CompanyService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildCompanyForm();
    this.getIdFromRoute();
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.companyService
          .getCompanyDetails(params.get("id"))
          .subscribe(res => {
            this.companyDetails = res.Entity;
            this.companyLogo = this.companyDetails.Logo;
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
      address1: [
        this.companyDetails ? this.companyDetails.Address1 : "",
        Validators.required
      ],
      address2: [this.companyDetails ? this.companyDetails.Address2 : ""],
      city: [this.companyDetails ? this.companyDetails.City : ""],
      district: [this.companyDetails ? this.companyDetails.District : ""],
      zone: [this.companyDetails ? this.companyDetails.Zone : ""],
      telephone: [this.companyDetails ? this.companyDetails.Telephone : ""],
      email: [this.companyDetails ? this.companyDetails.Email : ""],
      website: [this.companyDetails ? this.companyDetails.Website : ""],
      POBoxNo: [this.companyDetails ? this.companyDetails.POBox : ""],
      PANNo: [this.companyDetails ? this.companyDetails.PAN : ""],
      logo: [this.companyLogo ? this.companyLogo : ""],
      fiscalYear: [this.companyDetails ? this.companyDetails.FYFrom : ""],
      fiscalStyle: ["075/76"],
      booksBegin: [this.companyDetails ? this.companyDetails.BookBeginFrom : ""]
    });
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach(file => {
      if (!file.validationErrors) {
        var reader = new FileReader();

        var reader = new FileReader();
        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.companyLogo = event.target.result;
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public save(): void {
    if (this.companyForm.invalid) return;
    const obj = {
      ID: this.companyDetails.ID,
      Name: this.companyForm.get("companyName").value,
      Code: this.companyForm.get("code").value,
      Address1: this.companyForm.get("address1").value,
      Address2: this.companyForm.get("address2").value,
      City: this.companyForm.get("city").value,
      District: this.companyForm.get("district").value,
      Zone: this.companyForm.get("zone").value,
      Telephone: this.companyForm.get("telephone").value,
      Email: this.companyForm.get("email").value,
      Website: this.companyForm.get("website").value,
      POBox: this.companyForm.get("POBoxNo").value,
      PAN: this.companyForm.get("PANNo").value,
      Logo: this.companyLogo ? this.companyLogo : "",
      FYFrom: this.companyForm.get("fiscalYear").value,
      BookBeginFrom: this.companyForm.get("booksBegin").value,
      FiscalYear: this.companyForm.get("fiscalStyle").value
    };
    this.companyService.updateCompany(obj).subscribe(
      response => {
        this.router.navigate(["/company"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Company edited successfully");
      }
    );
  }

  public cancel(): void {
    this.companyForm.reset();
    this.router.navigate(["/company"]);
  }
}
