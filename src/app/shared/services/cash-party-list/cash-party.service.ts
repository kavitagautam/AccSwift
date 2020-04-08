import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
export interface CashPartyList {
  GroupID: number;
  GroupName: string;
  PurchaseRate: number;
  SalesRate: number;
  ClosingQty: number;
  UnitID: number;
  IsInventory: boolean;
  ID: number;
  Name: string;
  Code: string;
}

export interface CashPartyListModel {
  StatusCode: number;
  Message: string;
  Entity: CashPartyList[];
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

  getCashPartyList(): Observable<CashPartyListModel> {
    return this.httpService.get(`${this._api_URL}Product/LOP`);
  }
}
