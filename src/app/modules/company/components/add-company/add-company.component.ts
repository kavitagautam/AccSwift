import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { ToastrService } from "ngx-toastr";
import { SelectEvent } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-add-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./add-company.component.scss"],
})
export class AddCompanyComponent implements OnInit {
  companyLogo: any = "";

  companyForm: FormGroup;

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
      ID: [null],
      Name: ["", Validators.required],
      Code: ["", Validators.required],
      Telephone: [""],
      Email: [""],
      Website: [""],
      POBox: [""],
      PAN: [""],
      Logo: [""],
      Address1: [""],
      Address2: [""],
      CountryID: [null],
      StateOrProvinceID: [null],
      City: [""],
      District: [""],
      Zone: [""],
      FYFrom: [new Date()],
      FiscalYear: ["075/76"],
      BookBeginFrom: [""],
      Remarks: [""],
    });
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
      if (!file.validationErrors) {
        var reader = new FileReader();

        var reader = new FileReader();
        reader.onload = (event: any) => {
          // console.log(event.target.result);
          this.companyLogo = event.target.result;
          this.companyForm.get("Logo").setValue(this.companyLogo);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public save(): void {
    if (this.companyForm.invalid) return;

    this.companyService.addCompany(this.companyForm.value).subscribe(
      (response) => {
        this.router.navigate(["/company"]);
      },
      (error) => {
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
