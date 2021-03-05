import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ForgetPasswordService } from "../services/forget-password.service";
import { ForgetPassword, ForgetPasswordRootModel } from "../model/forget-password.model";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { ValidationMessageService } from "@accSwift-modules/accswift-shared/services/validation-message/validation-message.service";

@Component({
  selector: 'accSwift-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPwForm: FormGroup;
  submitted: boolean;
  forgetPassword: ForgetPassword;

  constructor(  private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private forgetPasswordService: ForgetPasswordService,
    private validationMessageService: ValidationMessageService,
    private toastr: ToastrService,
    private cookieService: CookieService ) { }

  ngOnInit() {
    this.buildForgetPwForm();
  }

  buildForgetPwForm():void {
    this.forgetPwForm = this._fb.group({
      email: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.validationMessageService.formSubmitted = true;
    if (this.forgetPwForm.invalid) return;
    
    this.forgetPasswordService.onSubmitForgetPassword(this.forgetPwForm.value).subscribe((response: ForgetPasswordRootModel) => {
      this.forgetPassword = response.Entity;
    },
    (error) => {
      this.toastr.error(JSON.stringify(error.error.Message));
    },
    () => {
      this.toastr.success("Token generated successfully");
    }
    );
  }

}
