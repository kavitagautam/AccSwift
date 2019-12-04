import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import {
  ProjectList,
  SeriesList,
  CashReceiptMaster,
  CashAccounts,
} from "../models/cash-receipt.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class CashReceiptService {
  seriesLists: SeriesList;
  projectLists: ProjectList;
  cashAccountLists;
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashReceiptAccounts();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    this.httpService
      .get(`${this._api_URL}series/journal`)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }

  getCashReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res : CashAccounts) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashReceiptMaster(): Observable<CashReceiptMaster[]> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster`);
  }

  getCashReceiptDetails(id): Observable<CashReceiptMaster> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster/${id}`);
  }

 
  getCashParty(): Observable<CashAccounts[]> {
    return this.httpService.get(`${this._api_URL} /Ledger/cashparty`);
  }
 
}
