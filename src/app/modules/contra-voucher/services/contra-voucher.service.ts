import {
  SeriesList,
  ProjectList,
  CashAccounts,
  ContraVoucherMaster,
  CashParty
} from "./../models/contraVoucher.model";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ContraVoucherService {
  seriesLists: SeriesList;
  projectLists: ProjectList;
  cashAccountLists;
  cashPartyLists;
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashReceiptAccounts();
    this.getCashPartyList();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_RCPT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: any) => {
        this.seriesLists = res.Entity;
        console.log(this.seriesLists);
      });
  }

  getCashReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res: CashAccounts) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashPartyList(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((res: CashParty) => {
        this.cashPartyLists = res.Entity;
      });
  }

  getCashReceiptMaster(): Observable<ContraVoucherMaster[]> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster`);
  }

  getContraVoucherDetails(id): Observable<ContraVoucherMaster> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster/${id}`);
  }

  getCashParty(): Observable<CashAccounts[]> {
    return this.httpService.get(`${this._api_URL} /Ledger/cashparty`);
  }
}
