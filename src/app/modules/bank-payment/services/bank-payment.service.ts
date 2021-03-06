import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BankPaymentNavigateModel,
  BankPaymentDetailModel,
} from "../models/bank-payment.model";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import {
  Series,
  SeriesRootModel,
} from "@accSwift-modules/accswift-shared/models/series.model";

@Injectable({
  providedIn: "root",
})
export class BankPaymentService {
  _api_URL = environment.baseAPI;
  seriesList: Series[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getSeriesList();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_PMNT"); // Series List for Bank Payment Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesList = response.Entity;
      });
  }

  getBankPaymentMaster(body): Observable<BankPaymentNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}BankPaymentMaster/navigate`,
      body
    );
  }

  getBankPaymentDetails(id): Observable<BankPaymentDetailModel> {
    return this.httpService.get(`${this._api_URL}BankPaymentMaster/${id}`);
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  updateBankPayment(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}BankPaymentMaster`, body);
  }

  addBankPayment(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}BankPaymentMaster`, body);
  }

  deleteBankPaymentByID(id): Observable<any> {
    return this.http.delete(`${this._api_URL}BankPaymentMaster/${id}`);
  }
}
