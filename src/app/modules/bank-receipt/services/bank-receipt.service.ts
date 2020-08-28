import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  BankReceiptNavigateModel,
  BankReceiptEditModel,
} from "../models/bank-receipt.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BankReceiptService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getBankReceiptMaster(body): Observable<BankReceiptNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}BankReceiptMaster/navigate`,
      body
    );
  }

  getBankReceiptDetails(id): Observable<BankReceiptEditModel> {
    return this.httpService.get(`${this._api_URL}BankReceiptMaster/${id}`);
  }

  addBankReceipt(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}BankReceiptMaster`, body);
  }

  updateBankReceipt(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}BankReceiptMaster`, body);
  }

  deleteBankReceiptByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}BankReceiptMaster/${id}`);
  }
}
