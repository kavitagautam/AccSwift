import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { ToastrService } from "ngx-toastr";

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
    private toastr: ToastrService
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
      logo: [""],
      fiscalYear: [""],
      fiscalStyle: ["075/76"],
      booksBegin: [""]
    });
  }

  imageURL = this.dataURItoBlob("");

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
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
      Logo: this.companyForm.get("logo").value,
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
