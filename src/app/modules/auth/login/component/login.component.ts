import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
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
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";

@Component({
  selector: "accSwift-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
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
    private toastr: ToastrService,
    private cookieService: CookieService // private settingsService: SettingsService, // private preferenceService: PreferenceService
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.buildLoginForm();
    // this.settingsService.getSettingsData();
    // this.preferenceService.getPreferenceData();
  }

  buildLoginForm() {
    this.loginForm = this._fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
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
        (data) => {
          // Set cookies Services
          for (const key in data) {
            if (data[key]) {
              // sessionStorage.setItem(key, data[key]);
              this.cookieService.set(
                "access_token",
                data.access_token,
                null,
                "/",
                null,
                false,
                "Lax"
              );
              this.cookieService.set(
                "token_type",
                data.token_type,
                null,
                "/",
                null,
                false,
                "Lax"
              );
              this.cookieService.set(
                "expires_in",
                data.expires_in,
                null,
                "/",
                null,
                false,
                "Lax"
              );
              this.cookieService.set(
                "refresh_token",
                data.refresh_token,
                null,
                "/",
                null,
                false,
                "Lax"
              );
              this.cookieService.set(
                "ExpiredDateTime",
                data.ExpiredDateTime,
                null,
                "/",
                null,
                false,
                "Lax"
              );
              // this.settingsService.getSettings();
              // this.preferenceService.getPerference();
              localStorage.setItem("user_type", data.UserType);
            }
          }

          this.router.navigate([""]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Login Successful!");
        }
      );
  }

  alert(event)
  {
    alert("Signup not available currently. Please contact the service provider.");
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
