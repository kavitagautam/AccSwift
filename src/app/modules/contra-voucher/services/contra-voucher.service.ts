import { ContraVoucherMaster } from "./../models/contraVoucher.model";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@accSwift-modules/accswift-shared/models/series.model";
import {
  CashAccountsModel,
  CashAccounts,
} from "@accSwift-modules/accswift-shared/models/cash-account.model";
import {
  CashPartyModel,
  CashParty,
} from "@accSwift-modules/accswift-shared/models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class ContraVoucherService {
  seriesLists: Series[] = [];
  projectLists: Project[] = [];
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
    this.getCashPartyList();
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
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesRootModel) => {
        this.seriesLists = res.Entity;
      });
  }

  getCashReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res: CashAccountsModel) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashPartyList(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((res: CashPartyModel) => {
        this.cashPartyLists = res.Entity;
      });
  }

  getCashReceiptMaster(): Observable<ContraVoucherMaster[]> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster`);
  }

  getContraVoucherDetails(id): Observable<ContraVoucherMaster> {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster/${id}`);
  }

  getCashParty(): Observable<CashPartyModel> {
    return this.httpService.get(`${this._api_URL}/Ledger/cashparty`);
  }
}
