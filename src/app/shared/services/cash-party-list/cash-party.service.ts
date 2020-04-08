import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
export interface CashParty {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface CashPartyList {
  Entity: CashParty[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface CashPartyListModel {
  StatusCode: number;
  Message: string;
  Entity: CashPartyList;
}
@Injectable({
  providedIn: "root",
})
export class CashPartyService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getCashPartyList(body): Observable<CashPartyListModel> {
    return this.httpService.post(
      `${this._api_URL}Ledger/navigate/cashparty`,
      body
    );
  }
}
