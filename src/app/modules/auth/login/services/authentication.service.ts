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
    const params = new HttpParams()
      .set("username", username)
      .set("password", password);
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "No-Auth": "True"
    });

    return this.httpService.get(
      `${this._api_URL}users/token`,
      reqHeader,
      params
    );
  }
  getToken() {
    return localStorage.getItem("token");
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
}
