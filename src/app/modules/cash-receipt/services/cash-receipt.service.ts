import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  ProjectList,
  SeriesList,
  CashAccountList,
  CashPartyList,
  ProjectListModel,
  CashReceiptNavigateModel,
  CashReceiptDetailModel,
} from "../models/cash-receipt.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CashReceiptService {
  seriesLists: SeriesList;
  projectLists: ProjectList[];
  cashAccountLists: CashAccountList;
  cashPartyLists: CashPartyList;
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashReceiptAccounts();
    this.getCashPartyLists();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectListModel) => {
        this.projectLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_RCPT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}Series`, null, params)
      .subscribe((res) => {
        this.seriesLists = res.Entity;
      });
  }

  getCashReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashPartyLists(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((res: any) => {
        this.cashPartyLists = res.Entity;
      });
  }

  getCashReceiptMaster(body): Observable<CashReceiptNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}CashReceiptMaster/navigate`,
      body
    );
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getCashReceiptDetails(id): Observable<CashReceiptDetailModel> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster/${id}`);
  }

  addCashReceipt(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}CashReceiptMaster`, body);
  }

  updateCashReceipt(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}CashReceiptMaster`, body);
  }

  deleteCashReceiptByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}CashReceiptMaster/${id}`);
  }

  getCashParty(): Observable<CashPartyList[]> {
    return this.httpService.get(`${this._api_URL} /Ledger/cashparty`);
  }
}
