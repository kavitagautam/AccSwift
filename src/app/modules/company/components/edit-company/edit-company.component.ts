import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "../../services/company.service";
import { Company, Suggestion } from "../../models/company.model";
import { ToastrService } from "ngx-toastr";
import { FileRestrictions, SelectEvent } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-edit-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./edit-company.component.scss"],
})
export class EditCompanyComponent implements OnInit {
  companyLogo: any = "";
  companyDetails: Company;
  companyForm: FormGroup;
  public myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };

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

  suggestion:Suggestion;

  Phone: string;

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
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.companyService
          .getCompanyDetails(params.get("id"))
          .subscribe((res) => {
            this.companyDetails = res.Entity;
            this.companyLogo = this.companyDetails.Logo;
            this.buildCompanyForm();
          });
      }
    });
  }

  buildCompanyForm(): void {
    this.companyForm = this._fb.group({
      ID: [this.companyDetails ? this.companyDetails.ID : null],
      Name: [
        this.companyDetails ? this.companyDetails.Name : "",
        Validators.required,
      ],
      Code: ["", Validators.required],
      Telephone: [this.companyDetails ? this.companyDetails.Telephone : ""],
      Email: [this.companyDetails ? this.companyDetails.Email : ""],
      Website: [this.companyDetails ? this.companyDetails.Website : ""],
      POBox: [this.companyDetails ? this.companyDetails.POBox : ""],
      PAN: [this.companyDetails ? this.companyDetails.PAN : ""],
      Logo: [this.companyDetails ? this.companyDetails.Logo : ""],
      Address1: [this.companyDetails ? this.companyDetails.Address1 : ""],
      Address2: [this.companyDetails ? this.companyDetails.Address2 : ""],

      City: [this.companyDetails ? this.companyDetails.City : ""],
      District: [this.companyDetails ? this.companyDetails.District : ""],
      CountryID: [this.companyDetails ? this.companyDetails.CountryID : null],
      StateOrProvinceID: [
        this.companyDetails ? this.companyDetails.StateOrProvinceID : null,
      ],
      Zone: [this.companyDetails ? this.companyDetails.Zone : ""],
      UserName: [
        this.companyDetails ? this.companyDetails.UserName : "",
        Validators.required,
      ],
      Password: [
        this.companyDetails ? this.companyDetails.Password : "",
        Validators.required,
      ],
      FYFrom: [this.companyDetails ? this.companyDetails.FYFrom : new Date()],
      FiscalYear: [
        this.companyDetails ? this.companyDetails.FiscalYear : "075/76",
      ],
      BookBeginFrom: [
        this.companyDetails ? this.companyDetails.BookBeginFrom : "",
      ],
      Remarks: [this.companyDetails ? this.companyDetails.Remarks : ""],
    });
  }

  public selectEventHandler(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
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



  suggestCode():void{
    this.getSuggestionData()
  }
  public getSuggestionData(): void {
    this.companyService.getCompanySuggestion(this.companyForm.value, this.companyForm.value.Name).subscribe(
      (response) => {
        this.suggestion = response.Entity;
      }
    )
  }

  public save(): void {
    if (this.companyForm.invalid) return;
    this.companyService.updateCompany(this.companyForm.value).subscribe(
      (response) => {
        this.router.navigate(["/company"]);
      },
      (error) => {
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
