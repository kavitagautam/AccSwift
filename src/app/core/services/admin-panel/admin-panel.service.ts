import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User, UserRootModel } from "@app/core/models/admin.model.ts";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class AdminPanelService {
  usersInfo: User;
  _api_URL = environment.baseAPI;
  constructor(
    private httclient: HttpClient,
    private httpService: HttpClientService
  ) {}

  getUserInfo(): Observable<UserRootModel> {
    return this.httpService.get(`${this._api_URL}/User/CurrentUser`);
  }

  //get side nav items

  // get messages

  // get notifications

  // search website
}
