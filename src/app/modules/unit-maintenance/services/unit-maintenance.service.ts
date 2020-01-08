import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { Units } from "../models/unit-maintenance.model";

@Injectable({
  providedIn: "root"
})
export class UnitMaintenanceService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getUnitList(): Observable<Units[]> {
    return this.httpService.get(`${this._api_URL}UnitMaintenance`);
  }

  deleteUnitById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}UnitMaintenance/${id}`);
  }

  getUnitDetails(id): Observable<Units>{
    return this.httpService.get(`${this._api_URL}UnitMaintenance/${id}`);
  }
}
