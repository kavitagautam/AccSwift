import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}
  login(username: string, password: string) {
    let body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);
    body.set("grant_type", "password");

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "No-Auth": "True"
    });

    return this.httpService.post(
      `${this._api_URL}token`,
      body.toString(),
      reqHeader
    );
  }
  getToken() {
    return localStorage.getItem("access_token");
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
}
