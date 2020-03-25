import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Settings } from "../models/settings.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  apiUrl = environment.baseAPI;
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getSettings(): Observable<Settings> {
    return this.httpService.get(`${this.apiUrl}Settings`);
  }
}
