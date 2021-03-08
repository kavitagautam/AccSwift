import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ForgetPasswordService } from "../services/forget-password.service";
import { ForgetPassword, ForgetPasswordRootModel, ResetPassword, ResetPasswordRootModel } from "../model/forget-password.model";
import { first, subscribeOn } from "rxjs/operators";
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
  resetPwForm: FormGroup;
  submitted: boolean;
  forgetPassword: ForgetPassword;
  resetPassword: ResetPassword;

  constructor(  private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private forgetPasswordService: ForgetPasswordService,
    private validationMessageService: ValidationMessageService,
    private toastr: ToastrService,
    private cookieService: CookieService ) { }

  ngOnInit() {
    this.buildForgetPwForm();
    this.buildResetPwForm();
  }

  buildForgetPwForm(): void {
    this.forgetPwForm = this._fb.group({
      email: ["", Validators.required]
    });
  }

  buildResetPwForm(): void {
    this.resetPwForm = this._fb.group({
      Token: ["", Validators.required],
      Password: ["", Validators.required],
      VerifyPassword: ["", Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.validationMessageService.formSubmitted = true;
    if (this.forgetPwForm.invalid) return;
    this.forgetPasswordService.onSubmitForgetPassword(this.forgetPwForm.value.email).subscribe((response: ForgetPasswordRootModel) => {
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

  onSubmitReset(): void {
    this.submitted = true;
    this.validationMessageService.formSubmitted = true;
    if (this.resetPwForm.invalid) return;
    this.forgetPasswordService.onSubmitResetPassword(this.resetPwForm.value.Token, this.resetPwForm.value.Password, this.resetPwForm.value.VerifyPassword).subscribe((response: ResetPasswordRootModel) => {
      this.resetPassword = response.Entity;
      this.router.navigate(["/login"]);
    },
    (error) => {
      this.toastr.error(JSON.stringify(error.error.Message));
    },
    () => {
      this.toastr.success("Password Reset successfully");
    }
    );  
  }

}
