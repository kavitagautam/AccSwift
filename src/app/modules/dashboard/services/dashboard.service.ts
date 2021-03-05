import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AccountTransact,
  AccountTransactRootModel,
  Account,
  AccountRootModel,
  InvTransact,
  InvTransactRootModel,
  GeneralSummary,
  GeneralSummaryRootModel,
  SalesMonthly,
  SalesMonthlyRootModel,
  PurchaseMonthly,
  PurchaseMonthlyRootModel,
  CheckingAccounts,
  CheckingAccountsRootModel

} from "@accSwift-modules/dashboard/models/dashboard-model.";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class DashBoardService {
  accountTransactionList: AccountTransact[] = [];
  Accounts: Account[] = [];
  invTransactionList: InvTransact[] = [];
  generalSummaryList: GeneralSummary[] = [];
  salesMonthly: SalesMonthly[] = [];
  purchaseMonthly: PurchaseMonthly[] = [];
  checkingAccounts: CheckingAccounts[] = [];
  _api_URL = environment.baseAPI;

  constructor(
    private httpclient: HttpClient,
    private httpService: HttpClientService
  ) {}

  getAccountTransact(): Observable<AccountTransactRootModel> {
    return this.httpService.get(`${this._api_URL}AccTransactSummary`);
  }

  getAccounts(): Observable<AccountRootModel> {
    return this.httpService.get(`${this._api_URL}AccountSummary`);
  }

  getInvTransact(): Observable<InvTransactRootModel> {
    return this.httpService.get(`${this._api_URL}InvTransactSummary`);
  }

  getGeneralSummary(): Observable<GeneralSummaryRootModel> {
    return this.httpService.get(`${this._api_URL}GeneralSummary`);
  }

  getSalesMonthly(): Observable<SalesMonthlyRootModel> {
    return this.httpService.get(`${this._api_URL}Transaction/SalesMonthly`);
  }

  getPurchaseMonthly(): Observable<PurchaseMonthlyRootModel> {
    return this.httpService.get(`${this._api_URL}Transaction/PurchMonthly`);
  }

  getCheckingAccounts(): Observable<CheckingAccountsRootModel>  {
    return this.httpService.get(`${this._api_URL}CheckingAccounts`);
  }

}
