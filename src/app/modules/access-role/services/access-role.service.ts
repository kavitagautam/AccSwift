import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  AccessRoleRootModel,
  AccessRoleTreeViewModel,
} from "../models/access-role.model";

@Injectable({
  providedIn: "root",
})
export class AccessRoleService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getAccessRoles(): Observable<AccessRoleRootModel> {
    return this.httpService.get(`${this._api_URL}AccessRole`);
  }

  getAccessRolesTreeView(): Observable<AccessRoleTreeViewModel> {
    return this.httpService.get(`${this._api_URL}Access/TreeView`);
  }
}
