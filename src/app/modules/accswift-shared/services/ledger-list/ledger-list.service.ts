import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
export interface LedgerList {
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface LedgerListModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerList[];
}

@Injectable({
  providedIn: "root"
})
export class LedgerListService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getLedgerList(): Observable<LedgerListModel> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }
}
