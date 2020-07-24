import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  CashPaymentNavigateModel,
  CashPaymentDetailModel,
} from "../models/cash-payment.model";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import {
  SeriesRootModel,
  Series,
} from "@accSwift-modules/accswift-shared/models/series.model";
import {
  CashAccounts,
  CashAccountsModel,
} from "@accSwift-modules/accswift-shared/models/cash-account.model";
import {
  CashParty,
  CashPartyModel,
} from "@accSwift-modules/accswift-shared/models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class CashPaymentService {
  seriesLists: Series[] = [];
  cashAccountLists: CashAccounts[] = [];
  cashPartyLists: CashParty[] = [];
  projectLists: Project[] = [];
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashPaymentAccounts();
    this.getCashParty();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_PMNT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesLists = response.Entity;
      });
  }

  getCashPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res: CashAccountsModel) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashParty(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: CashPartyModel) => {
        this.cashPartyLists = response.Entity;
      });
  }

  getCashPaymentMaster(body): Observable<CashPaymentNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}CashPaymentMaster/navigate`,
      body
    );
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getCashPaymentDetails(id): Observable<CashPaymentDetailModel> {
    return this.httpService.get(`${this._api_URL}CashPaymentMaster/${id}`);
  }

  addCashPayment(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}CashPaymentMaster`, body);
  }

  updateCashPayment(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}CashPaymentMaster`, body);
  }

  deleteCashPaymentByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}CashPaymentMaster/${id}`);
  }
}
