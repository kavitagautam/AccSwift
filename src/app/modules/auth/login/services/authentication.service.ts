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
    const obj = {
      UserName: username,
      Password: password
    };
    return this.httpService.post(`${this._api_URL}User/Login`, obj);
  }

  getToken() {
    return sessionStorage.getItem("access_token");
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
