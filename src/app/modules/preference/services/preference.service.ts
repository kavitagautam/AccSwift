import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  PreferenceModel,
  Preferences,
  PurchaseAccountModel,
  DATE_FORMAT_MODEL,
} from "../models/preference.model";
import { Router } from "@angular/router";
import { SeriesRootModel } from "@accSwift-modules/accswift-shared/models/series.model";
import { BankAccountsModel } from "@accSwift-modules/accswift-shared/models/bank-account.model";
import { CashAccountsModel } from "@accSwift-modules/accswift-shared/models/cash-account.model";
import { SalesAccountModel } from "@accSwift-modules/accswift-shared/models/sales-account.model";
import { AccountClassModel } from "@accSwift-modules/accswift-shared/models/account-class.model";
import { DepotModel } from "@accSwift-modules/depot/models/depot.model";
import { ProjectRootModel } from "@accSwift-modules/accswift-shared/models/project.model";

@Injectable({
  providedIn: "root",
})
export class PreferenceService {
  _api_URL = environment.baseAPI;
  preferences: Preferences;
  preferencesList: Preferences;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getPerference();
  }

  getDepotDD(): Observable<DepotModel> {
    return this.httpService.get(`${this._api_URL}Depot`);
  }

  getProjectDD(): Observable<ProjectRootModel> {
    return this.httpService.get(`${this._api_URL}project`);
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
        localStorage.setItem(
          "decimalPlaces",
          JSON.stringify(this.preferences.DEFAULT_DECIMALPLACES.Value)
        );
      });
  }

  getStuff(): Promise<void> {
    return this.getPreferenceData()
      .toPromise()
      .then((data) => {
        this.preferences = data.Entity;
      });
  }

  getAppPreference(): void {
    this.httpService
      .get(`${this._api_URL}UserPreference`)
      .subscribe((response: PreferenceModel) => {
        const data = response.Entity;
        if (data.DEFAULT_DATE.Value === "Nepali") {
          data.DEFAULT_DATE.Value = "ne";
        } else {
          data.DEFAULT_DATE.Value = "en_US";
        }
        if (data.DEFAULT_DECIMALPLACES.Value) {
          data.DECIMAL_PLACES_FORMAT = "n" + data.DEFAULT_DECIMALPLACES.Value;
        }
        this.preferences = data;
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

  getDateFormats(): Observable<DATE_FORMAT_MODEL> {
    return this.httpService.get(`${this._api_URL}UserPreference/DateFormats`);
  }

  updatePreference(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}UserPreference`, body);
  }

  getSeriesList(voucherType): Observable<SeriesRootModel> {
    const params = new HttpParams().set("VoucherType", voucherType);
    return this.httpService.get(`${this._api_URL}Series`, null, params);
  }
}
