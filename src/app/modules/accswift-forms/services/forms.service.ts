import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ProjectRootModel } from "@accSwift-modules/accswift-shared/models/project.model";
import { SeriesRootModel } from "@accSwift-modules/accswift-shared/models/series.model";
import { CashAccountsModel } from "@app/modules/accswift-shared/models/cash-account.model";
import { BankAccountsModel } from "@app/modules/accswift-shared/models/bank-account.model";

@Injectable({
  providedIn: "root",
})
export class FormsService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getSeriesList(voucherType): Observable<SeriesRootModel> {
    const params = new HttpParams().set("VoucherType", voucherType);
    return this.httpService.get(`${this._api_URL}Series`, null, params);
  }

  getProjectLists(): Observable<ProjectRootModel> {
    return this.httpService.get(`${this._api_URL}project`);
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getCashAccounts(): Observable<CashAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/CashAccounts`);
  }

  getBankAccounts(): Observable<BankAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/BankAccounts`);
  }
}
