import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SeriesList,
  ProjectList,
  CashAccounts,
  CashParty,
  CashPaymentNavigateModel,
  CashPaymentDetailModel,
} from "../models/cash-payment.model";

@Injectable({
  providedIn: "root",
})
export class CashPaymentService {
  seriesLists: SeriesList;
  cashAccountLists: CashAccounts;
  cashPartyLists: CashParty;
  projectLists: ProjectList[] = [];
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
    this.httpService.get(`${this._api_URL}project`).subscribe((res: any) => {
      this.projectLists = res.Entity;
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

  getCashPaymentMaster(body): Observable<CashPaymentNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}CashPaymentMaster/navigate`,
      body
    );
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getCashPaymentDetails(id): Observable<CashPaymentDetailModel> {
    return this.httpService.get(`${this._api_URL}CashPaymentMaster/${id}`);
  }

  addCashPayment(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}CashPaymentMaster`, body);
  }

  updateCashPayment(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}CashPaymentMaster`, body);
  }

  deleteCashPaymentByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}CashPaymentMaster/${id}`);
  }
}
