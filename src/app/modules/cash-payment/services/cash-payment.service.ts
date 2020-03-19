import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SeriesList,
  ProjectList,
  CashPaymentMaster,
  LedgerList,
  CashAccounts,
  CashParty
} from "../models/cash-payment.model";

@Injectable({
  providedIn: "root"
})
export class CashPaymentService {
  seriesLists: SeriesList;
  cashAccountLists: CashAccounts;
  cashPartyLists: CashParty;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashPaymentAccounts();
    this.getCashParty();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_PMNT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: any) => {
        this.seriesLists = res.Entity;
      });
  }

  getCashPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res: any) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashParty(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((res: any) => {
        this.cashPartyLists = res.Entity;
      });
  }

  getCashPaymentMaster(): Observable<CashPaymentMaster[]> {
    return this.http.get<CashPaymentMaster[]>(
      `${this._api_URL}CashPaymentMaster`
    );
  }

  getCashPaymentDetails(id): Observable<CashPaymentMaster> {
    return this.httpService.get(`${this._api_URL}CashPaymentMaster/${id}`);
  }

  getLedgerList(): Observable<LedgerList[]> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }
}
