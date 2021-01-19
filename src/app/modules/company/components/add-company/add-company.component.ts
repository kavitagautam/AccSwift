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
  username: string[] = [
    " Young Innovations ",
    "Imagine Web Solution ",
    "Smart Designs ",
    " 	F1Soft International ",
    "Bent Ray Technologies ",
    "Pracas Infosys ",
    "SoftNEP",
    "Peace Nepal DOT Com ",
  ];

  companycode: string[] = [
    "+977",
    "+01",
    "+93",
    "+02",
    "+03",
    "+04",
    "+05",
    "+06",
    "+07",
    "+08",
    "+09",
    "+010",
  ];

  Phone: string;

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
      ID: [0],
      Name: ["", Validators.required],
      Code: ["", Validators.required],
      Telephone: [""],
      Email: ["", [Validators.required, Validators.email]],
      Phone: ["", [Validators.required]],
      Website: [""],
      POBox: [""],
      PAN: [""],
      Logo: [""],
      Address1: [""],
      Address2: [""],
      CountryID: [null, [Validators.required]],
      StateOrProvinceID: [null],
      City: [""],
      District: [""],
      Zone: [""],
      UserName: ["", Validators.required],
      Password: ["", Validators.required],
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
    console.log(JSON.stringify(this.companyForm.getRawValue()));
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
