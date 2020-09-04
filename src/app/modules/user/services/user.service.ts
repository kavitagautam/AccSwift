import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  UserRootModel,
  UserNavigateModel,
  AccessRoles,
  AccessRoleRootModel,
} from "../models/user.model";
import { Observable } from "rxjs";
import {
  AccountClassModel,
  AccountClass,
} from "@accSwift-modules/accswift-shared/models/account-class.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  _api_URL = environment.baseAPI;
  accessRoles: AccessRoles[] = [];
  accountClass: AccountClass[] = [];
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getAccessRole();
    this.getAccountClass();
  }

  getAccessRole(): void {
    this.httpService
      .get(`${this._api_URL}AccessRole/min`)
      .subscribe((response: AccessRoleRootModel) => {
        this.accessRoles = response.Entity;
      });
  }

  getAccountClass(): void {
    this.httpService
      .get(`${this._api_URL}AccountClass/min`)
      .subscribe((response: AccountClassModel) => {
        this.accountClass = response.Entity;
      });
  }

  getUser(body): Observable<UserNavigateModel> {
    return this.httpService.post(`${this._api_URL}User/navigate`, body);
  }

  deleteUserById(userId): Observable<any> {
    return this.http.delete(`${this._api_URL}User/${userId}`);
  }

  getUserDetails(userId): Observable<UserRootModel> {
    return this.httpService.get(`${this._api_URL}User/${userId}`);
  }

  saveUser(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}User`, body);
  }

  updateUser(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}User`, body);
  }
}
