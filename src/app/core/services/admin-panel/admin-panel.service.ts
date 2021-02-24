import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class AdminPanelService {
  _api_URL = environment.baseAPI;
  constructor(
    private httclient: HttpClient,
    private httpService: HttpClientService
  ) {}


  //get side nav items

  // get messages

  // get notifications

  // search website
}
