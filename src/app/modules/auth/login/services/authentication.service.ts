import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService,
    private cookieService: CookieService,
    private router: Router
  ) {}
  login(username: string, password: string) {
    const obj = {
      UserName: username,
      Password: password,
    };
    return this.httpService.post(`${this._api_URL}User/Login`, obj);
  }

  logout() {
    this.cookieService.deleteAll("/");
    this.router.navigate(["/login"]);
  }

  getToken() {
    return this.cookieService.get("access_token");
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
