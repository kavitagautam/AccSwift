import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  CashReceiptNavigateModel,
  CashReceiptDetailModel,
} from "../models/cash-receipt.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CashReceiptService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

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
}
