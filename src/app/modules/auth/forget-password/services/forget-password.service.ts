import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { ForgetPassword, ForgetPasswordRootModel } from "../model/forget-password.model";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  _api_URL = environment.baseAPI;
  forgetPassword: ForgetPassword;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  onSubmitForgetPassword(email: string): Observable<ForgetPasswordRootModel> {
    const obj = {
      Email: email
    };
    return this.httpService.post(`${this._api_URL}User/ResetPasswordToken`, obj);
  }

}
