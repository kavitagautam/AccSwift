import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  CashReceiptNavigateModel,
  CashReceiptDetailModel,
} from "../models/cash-receipt.model";
import { Observable } from "rxjs";
import {
  Project,
  ProjectRootModel,
} from "@app/modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@app/modules/accswift-shared/models/series.model";
import { CashAccounts } from "@app/modules/accswift-shared/models/cash-account.model";
import {
  CashParty,
  CashPartyModel,
} from "@app/modules/accswift-shared/models/cash-party.model";
@Injectable({
  providedIn: "root",
})
export class CashReceiptService {
  seriesLists: Series[] = [];
  projectLists: Project[];
  cashAccountLists: CashAccounts[] = [];
  cashPartyLists: CashParty[] = [];
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getCashReceiptAccounts();
    this.getCashPartyLists();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_RCPT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}Series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesLists = response.Entity;
      });
  }

  getCashReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashPartyLists(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((res: any) => {
        this.cashPartyLists = res.Entity;
      });
  }

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

  getCashParty(): Observable<CashPartyModel> {
    return this.httpService.get(`${this._api_URL}/Ledger/cashparty`);
  }
}
