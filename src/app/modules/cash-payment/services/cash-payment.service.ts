import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  CashPaymentNavigateModel,
  CashPaymentDetailModel,
} from "../models/cash-payment.model";
import {
  SeriesRootModel,
  Series,
} from "@accSwift-modules/accswift-shared/models/series.model";
import {
  CashParty,
  CashPartyModel,
} from "@accSwift-modules/accswift-shared/models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class CashPaymentService {
  _api_URL = environment.baseAPI;
  seriesLists: Series[] = [];
  cashPartyLists: CashParty[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getSeriesList();
    this.getCashParty();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_PMNT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesLists = response.Entity;
      });
  }

  getCashParty(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: CashPartyModel) => {
        this.cashPartyLists = response.Entity;
      });
  }

  getCashPaymentMaster(body): Observable<CashPaymentNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}CashPaymentMaster/navigate`,
      body
    );
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
