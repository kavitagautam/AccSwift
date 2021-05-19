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

  getAccessRoleById(id): Observable<AccessRoleRootModel> {
    return this.httpService.get(`${this._api_URL}AccessRole/${id}`);
  }
 
  addAccessRoles(body): Observable<AccessRoleRootModel> {
    return this.httpService.post(`${this._api_URL}AccessRole`, body);
  }

  updateAccessRoles(body): Observable<AccessRoleRootModel> {
    return this.httpService.put(`${this._api_URL}AccessRole`, body);
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
  
  deleteAccessRoles(id): Observable<AccessRoleRootModel> {
    return this.httpService.delete(`${this._api_URL}AccessRole/${id}`);
  }
}
