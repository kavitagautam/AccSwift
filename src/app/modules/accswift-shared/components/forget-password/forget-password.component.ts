import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ForgetPassword, ForgetPasswordRootModel, ResetPassword, ResetPasswordRootModel } from "../../models/forget-password.model";
import { first, subscribeOn } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ForgetPasswordService } from '@accSwift-modules/accswift-shared/services/forget-password/forget-password.service';

@Component({
  selector: 'accSwift-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPwForm: FormGroup;
  resetPwForm: FormGroup;
  forgetSubmitted: boolean;
  resetSubmitted: boolean;

  constructor(  private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    public modalRef: BsModalRef,
    private forgetPasswordService: ForgetPasswordService,
    private modalService: BsModalService,
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


  close():void{
    this.modalRef.hide()
  }

  onSubmit(): void {
    
    if (this.forgetPwForm.invalid) return;
    this.forgetPasswordService.onSubmitForgetPassword(this.forgetPwForm.value.email).subscribe((response: ForgetPasswordRootModel) => {
      this.forgetSubmitted = true;
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
   
    if (this.resetPwForm.invalid) return;
    this.forgetPasswordService.onSubmitResetPassword(this.resetPwForm.value.Token, this.resetPwForm.value.Password, this.resetPwForm.value.VerifyPassword).subscribe((response: ResetPasswordRootModel) => {
      this.resetSubmitted = true;
      this.router.navigate(["/login"]);
    },
    (error) => {
      this.toastr.error(JSON.stringify(error.error.Message));
    },
    () => {
      this.toastr.success("Password Reset successfully");
      this.close();
    }
    );  
  }

}
