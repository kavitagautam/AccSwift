import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  SalesOrderNavigateModel,
  SalesOrderDetailModel,
} from "../models/sales-order.model";
import {
  Project,
  ProjectRootModel,
} from "@app/modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@app/modules/accswift-shared/models/series.model";
import { CashParty } from "@app/modules/accswift-shared/models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class SalesOrderService {
  _api_URL = environment.baseAPI;
  cashPartyList: CashParty[] = [];
  projectList: Project[] = [];
  seriesList: Series[] = [];

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getCashPartyAccount();
    this.getProjectList();
    this.getSeriesList();
  }

  getCashPartyAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: any) => {
        this.cashPartyList = response.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SLS_ORDER");
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesList = response.Entity;
      });
  }
  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectRootModel) => {
        this.projectList = response.Entity;
      });
  }
  getSalesOrderMaster(body): Observable<SalesOrderNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}SalesOrderMaster/navigate`,
      body
    );
  }

  getVoucherNoWithSeriesChange(seriesId): Observable<any> {
    const params = new HttpParams().set("SeriesID", seriesId);
    return this.httpService.get(
      `${this._api_URL}Series/VoucherNo`,
      null,
      params
    );
  }

  getCashPartyAccountDD(): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/cashparty`);
  }

  getSalesOrderDetails(id: any): Observable<SalesOrderDetailModel> {
    return this.httpService.get(`${this._api_URL}SalesOrderMaster/${id}`);
  }

  addSalesOrder(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}SalesOrderMaster`, body);
  }

  updateSalesOrder(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}SalesOrderMaster`, body);
  }

  deleteSalesById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}SalesOrderMaster/${id}`);
  }
}
