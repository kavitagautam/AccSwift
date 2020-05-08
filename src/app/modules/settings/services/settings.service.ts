import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import {
  SettingsModel,
  Settings,
  CashAccountsModel,
  BankAccountsModel,
  AccountClassModel,
  PurchaseAccountModel,
  SalesAccountModel,
} from "../models/settings.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  _api_URL = environment.baseAPI;
  settings: Settings;
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getSettings();
  }

  getSettings(): void {
    this.httpService
      .get(`${this._api_URL}Settings`)
      .subscribe((response: SettingsModel) => {
        this.settings = response.Entity;
      });
  }

  getCashReceiptAccounts(): Observable<CashAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/CashAccounts`);
  }

  getBankReceiptAccounts(): Observable<BankAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/BankAccounts`);
  }

  getSalesAccount(): Observable<SalesAccountModel> {
    return this.httpService.get(`${this._api_URL}Ledger/salesAccounts`);
  }

  getPurchaseAccount(): Observable<PurchaseAccountModel> {
    return this.httpService.get(`${this._api_URL}Ledger/purchAccounts`);
  }

  getAccountClass(): Observable<AccountClassModel> {
    return this.httpService.get(`${this._api_URL}AccountClass`);
  }
}
