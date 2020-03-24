import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { ToastrService } from "ngx-toastr";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { Observable, fromEvent } from "rxjs";
import { pluck } from "rxjs/operators";
import { SelectEvent } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-add-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./add-company.component.scss"]
})
export class AddCompanyComponent implements OnInit {
  companyLogo: any = "";

  companyForm: FormGroup;
  regexConst = RegexConst;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildCompanyForm();
  }

  buildCompanyForm(): void {
    this.companyForm = this._fb.group({
      companyName: ["", Validators.required],
      code: ["", Validators.required],
      address1: ["", Validators.required],
      address2: [""],
      city: [""],
      district: [""],
      zone: [""],
      telephone: [""],
      email: [""],
      website: [" "],
      POBoxNo: [""],
      PANNo: [""],
      logo: [""],
      fiscalYear: [""],
      fiscalStyle: ["075/76"],
      booksBegin: [""]
    });
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach(file => {
      if (!file.validationErrors) {
        var reader = new FileReader();

        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.companyLogo = event.target.result;

          console.log(this.companyLogo);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public save(): void {
    if (this.companyForm.invalid) return;
    const obj = {
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
    this.companyService.addCompany(obj).subscribe(
      response => {
        this.router.navigate(["/company"]);
      },
      error => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Company added successfully");
      }
    );
  }

  public cancel(): void {
    this.companyForm.reset();
    this.router.navigate(["/company"]);
  }
}
