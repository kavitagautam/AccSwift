import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TrailBalanceModel } from "../models/trail-balance.model";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getGroupBalanceData(): Observable<TrailBalanceModel> {
    return this.httpService.get(`${this._api_URL}/Ledger/GroupBalance`);
  }
}
