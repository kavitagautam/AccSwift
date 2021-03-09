import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { ForgetPassword, ForgetPasswordRootModel, ResetPassword, ResetPasswordRootModel } from "../../models/forget-password.model";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  _api_URL = environment.baseAPI;
  forgetPassword: ForgetPassword;
  resetPassword: ResetPassword;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  onSubmitForgetPassword(email: string): Observable<ForgetPasswordRootModel> {
    let body = {}
        return this.httpService.post(`${this._api_URL}User/ResetPasswordToken?email=${email}`, body);
  }

  onSubmitResetPassword( Token: string, Password: string, VerifyPassword: string): Observable<ResetPasswordRootModel> {
    let body = {
      token: Token,
      password: Password,
      verifyPassword: VerifyPassword
    }
      return this.httpService.post(`${this._api_URL}User/ResetPassword`, body);
  }

}
