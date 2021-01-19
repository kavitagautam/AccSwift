import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable, Subject } from "rxjs";
import {
  ProjectRootModel,
  Project,
} from "@accSwift-modules/accswift-shared/models/project.model";
import { SeriesRootModel } from "@accSwift-modules/accswift-shared/models/series.model";
import { CashAccountsModel } from "@accSwift-modules/accswift-shared/models/cash-account.model";
import { BankAccountsModel } from "@accSwift-modules/accswift-shared/models/bank-account.model";
import {
  CashParty,
  CashPartyModel,
} from "@accSwift-modules/accswift-shared/models/cash-party.model";
import {
  SalesAccountModel,
  SalesAccounts,
} from "@accSwift-modules/accswift-shared/models/sales-account.model";
import { Depot, DepotModel } from "@accSwift-modules/depot/models/depot.model";
import { PurchaseAccountRootModel } from "@accSwift-modules/accswift-shared/models/purchase-account.model";

@Injectable({
  providedIn: "root",
})
export class FormsService {
  private seriesSelectedValue = new Subject<number>();
  seriesSelect$ = this.seriesSelectedValue.asObservable();
  depotList: Depot[] = [];

  // Service message commands
  seriesSelect(seriesID: number) {
    this.seriesSelectedValue.next(seriesID);
  }
  cashPartyList: CashParty[] = [];
  salesAccountList: SalesAccounts[] = [];
  projectList: Project[];

  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getCashPartyAccount();
    this.getSalesAccount();
    this.getDepotList();
    this.getProjectLists();
  }

  getAllDropDownList() {
    this.getCashPartyAccount();
    this.getSalesAccount();
    this.getDepotList();
    this.getProjectLists();
  }

  getSeriesList(voucherType): Observable<SeriesRootModel> {
    const params = new HttpParams().set("VoucherType", voucherType);
    return this.httpService.get(`${this._api_URL}Series`, null, params);
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectRootModel) => {
        this.projectList = response.Entity;
      });
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getCashAccounts(): Observable<CashAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/CashAccounts`);
  }

  getPurchaseAccounts(): Observable<PurchaseAccountRootModel> {
    return this.httpService.get(`${this._api_URL}Ledger/purchAccounts`);
  }

  getBankAccounts(): Observable<BankAccountsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/BankAccounts`);
  }

  getVoucherNoWithSeriesChange(seriesId): Observable<any> {
    const params = new HttpParams().set("SeriesID", seriesId);
    return this.httpService.get(
      `${this._api_URL}Series/VoucherNo`,
      null,
      params
    );
  }

  getCashPartyAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: any) => {
        this.cashPartyList = response.Entity;
      });
  }

  getSalesAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/salesAccounts`)
      .subscribe((response: SalesAccountModel) => {
        this.salesAccountList = response.Entity;
      });
  }

  getSalesAccountDD(): Observable<SalesAccountModel> {
    return this.httpService.get(`${this._api_URL}Ledger/salesAccounts`);
  }

  getCashPartyAccountDD(): Observable<CashPartyModel> {
    return this.httpService.get(`${this._api_URL}Ledger/cashparty`);
  }

  getDepotList(): void {
    this.httpService
      .get(`${this._api_URL}Depot`)
      .subscribe((response: DepotModel) => {
        this.depotList = response.Entity;
      });
  }
}
