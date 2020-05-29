import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from "@angular/forms";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";

@Component({
  selector: "accSwift-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string;
  loginForm: FormGroup;
  submitted: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private validationMessageService: ValidationMessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this._fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  login(): void {
    this.submitted = true;
    this.validationMessageService.formSubmitted = true;

    if (this.loginForm.invalid) return;

    this.authenticationService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        data => {
          // Set sessionStorage
          for (const key in data) {
            if (data[key]) {
              sessionStorage.setItem(key, data[key]);
            }
          }
          this.router.navigate([""]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Login Successful!");
        }
      );
  }

  // form controls
  get username(): AbstractControl {
    return this.loginForm.get("username");
  }

  get password(): AbstractControl {
    return this.loginForm.get("password");
  }

  ngOnDestroy() {
    this.validationMessageService.formSubmitted = false;
  }
}
