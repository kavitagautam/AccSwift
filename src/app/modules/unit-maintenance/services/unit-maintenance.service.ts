import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  Units,
  UnitsModel,
  UnitsDetailsModel
} from "../models/unit-maintenance.model";

@Injectable({
  providedIn: "root"
})
export class UnitMaintenanceService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  // getUnitList(): Observable<UnitsModel> {
  //   return this.httpService.get(`${this._api_URL}UnitMaintenance`);
  // }

  getUnitList(body): Observable<UnitsModel> {
    const obj = {
      PageNo: body.unit,
      DisplayRow: body.symbol,
      Direction: body.remarks,
      FilterList: [
        {
          Attribute: "string",
          Operator: "string",
          Value: "string"
        }
      ]
    };
    return this.httpService.post(
      `${this._api_URL}UnitMaintenance/navigate`,
      body
    );
  }

  deleteUnitById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}UnitMaintenance/${id}`);
  }

  getUnitDetails(id): Observable<UnitsDetailsModel> {
    return this.httpService.get(`${this._api_URL}UnitMaintenance/${id}`);
  }

  saveUnit(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}UnitMaintenance`, body);
  }

  updateUnit(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}UnitMaintenance`, body);
  }
}
