import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import {
  SettingsModel,
  Settings,
  PurchaseAccountModel,
  DATE_FORMAT_MODEL,
} from "../models/settings.model";
import { Observable } from "rxjs";
import { BankAccountsModel } from "@app/modules/accswift-shared/models/bank-account.model";
import { CashAccountsModel } from "@app/modules/accswift-shared/models/cash-account.model";
import { SalesAccountModel } from "@app/modules/accswift-shared/models/sales-account.model";
import { AccountClassModel } from "@app/modules/accswift-shared/models/account-class.model";

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

  getSettingsData(): Observable<SettingsModel> {
    return this.httpService.get(`${this._api_URL}Settings`);
  }

  updateSettings(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}Settings`, body);
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
  getDateFormats(): Observable<DATE_FORMAT_MODEL> {
    return this.httpService.get(`${this._api_URL}UserPreference/DateFormats`);
  }
}
