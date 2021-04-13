import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { ToastrService } from "ngx-toastr";
import { SelectEvent } from "@progress/kendo-angular-upload";
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { Suggestion } from '@accSwift-modules/company/models/company.model';

@Component({
  selector: "accSwift-add-company",
  templateUrl: "../common-template/company-form.html",
  styleUrls: ["./add-company.component.scss"],
})
export class AddCompanyComponent implements OnInit {

  fieldTextType: boolean;

  suggestion:Suggestion;

  Phone: string;

  companyLogo: any = "";

  companyForm: FormGroup;

  public myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };

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
      Code: [
        this.suggestion ? this.suggestion.SuggestedCompanyCode : "",
        Validators.required,
      ],
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
      UserName: [this.suggestion ? this.suggestion.SuggestedUserName: "", Validators.required],
      Password: ["", Validators.required],
      FYFrom: [new Date()],
      FiscalYear: ["075/76"],
      BookBeginFrom: [""],
      Remarks: [""],
    });
    console.log(this.companyForm.value)
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

  public getSuggestionData(): void {
    this.companyService.getCompanySuggestion(this.companyForm.value,this.companyForm.value.Name).subscribe(
      (response) => {
        this.suggestion = response.Entity;
        this.companyForm.get("Code").setValue(response.Entity.SuggestedCompanyCode);
        this.companyForm.get("UserName").setValue(response.Entity.SuggestedUserName);
      }
    )
  }

  suggestCode():void{
    this.getSuggestionData();
  }
  
  togglePwFieldType():void {
    this.fieldTextType = !this.fieldTextType;
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
