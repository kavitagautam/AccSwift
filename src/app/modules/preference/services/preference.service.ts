import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  PreferenceModel,
  CashAccountsModel,
  Preferences,
  BankAccountsModel,
  SalesAccountModel,
  PurchaseAccountModel,
  AccountClassModel,
} from "../models/preference.model";

@Injectable({
  providedIn: "root",
})
export class PreferenceService {
  _api_URL = environment.baseAPI;
  preferences: Preferences;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getPerference();
  }

  getCashReceiptAccounts(): Observable<CashAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/CashAccounts`);
  }

  getBankReceiptAccounts(): Observable<BankAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/BankAccounts`);
  }

  getPerference(): void {
    this.httpService
      .get(`${this._api_URL}UserPreference`)
      .subscribe((response: PreferenceModel) => {
        this.preferences = response.Entity;
        //console.log("Dsadas dsa" + JSON.stringify(this.preferences));
      });
  }

  getPreferenceData(): Observable<PreferenceModel> {
    return this.httpService.get(`${this._api_URL}UserPreference`);
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
