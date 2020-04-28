import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { SettingsDataModel } from "../models/settings.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  _api_URL = environment.baseAPI;
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getSettings(): Observable<SettingsDataModel> {
    return this.httpService.get(`${this._api_URL}Settings`);
  }
}
