import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  AccessNavigateRootModel,
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

  addAccessRoles(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}AccessRole`, body);
  }

  getAccessRolesTreeView(): Observable<AccessRoleTreeViewModel> {
    return this.httpService.get(`${this._api_URL}Access/TreeView`);
  }

  getAccessRolesTreeViewID(id): Observable<AccessRoleTreeViewModel> {
    return this.httpService.get(`${this._api_URL}Access/${id}`);
  }

  getAccessRolesNavigate(body): Observable<AccessNavigateRootModel>
  {
    return this.httpService.post(`${this._api_URL}AccessRole/navigate`, body)
  }
}
