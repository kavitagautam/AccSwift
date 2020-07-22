import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import {
  SalesReturnNavigateModel,
  SalesReturnDetailModel,
} from "../models/sales-return.model";
import { Observable } from "rxjs";
import {
  Project,
  ProjectRootModel,
} from "@app/modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@app/modules/accswift-shared/models/series.model";
import { CashParty } from "@app/modules/accswift-shared/models/cash-party.model";
import {
  SalesAccounts,
  SalesAccountModel,
} from "@app/modules/accswift-shared/models/sales-account.model";
import { Tax, TaxModel } from "@app/modules/accswift-shared/models/tax.model";
import { RelatedUnitModel } from "@app/modules/accswift-shared/models/related-unit.model";
import { Depot, DepotModel } from "@app/modules/depot/models/depot.model";

@Injectable({
  providedIn: "root",
})
export class SalesReturnService {
  _api_URL = environment.baseAPI;
  seriesList: Series[] = [];
  projectList: Project[] = [];
  cashPartyList: CashParty[] = [];
  salesAccountList: SalesAccounts[] = [];
  depotList: Depot[] = [];
  taxList: Tax[] = [];

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getSeriesList();
    this.getDepotList();
    this.getCashPartyAccount();
    this.getSalesAccount();
    this.getProjectList();
    this.getTaxList();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SLS_RTN");
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesList = response.Entity;
      });
  }

  getSalesAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/salesAccounts`)
      .subscribe((response: SalesAccountModel) => {
        this.salesAccountList = response.Entity;
      });
  }

  getCashPartyAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: any) => {
        this.cashPartyList = response.Entity;
      });
  }

  getDepotList(): void {
    this.httpService
      .get(`${this._api_URL}Depot`)
      .subscribe((response: DepotModel) => {
        this.depotList = response.Entity;
      });
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectRootModel) => {
        this.projectList = response.Entity;
      });
  }

  getRelatedUnits(id: any): Observable<RelatedUnitModel> {
    return this.httpService.get(
      `${this._api_URL}CompoundUnit/RelatedUnits/${id}`
    );
  }

  getTaxList(): void {
    this.httpService
      .get(`${this._api_URL}Tax/min`)
      .subscribe((response: TaxModel) => {
        this.taxList = response.Entity;
      });
  }

  getCashPartyAccountDD(): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/cashparty`);
  }

  getSalesReturnMaster(body): Observable<SalesReturnNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}SalesReturnMaster/navigate`,
      body
    );
  }

  getSalesReturnDetails(id: any): Observable<SalesReturnDetailModel> {
    return this.httpService.get(`${this._api_URL}SalesReturnMaster/${id}`);
  }

  addSalesReturn(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}SalesReturnMaster`, body);
  }

  updateSalesReturn(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}SalesReturnMaster`, body);
  }

  deleteSalesById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}SalesReturnMaster/${id}`);
  }
}
