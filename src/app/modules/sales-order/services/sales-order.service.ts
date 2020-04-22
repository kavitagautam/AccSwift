import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  SalesOrderNavigateModel,
  SalesOrderDetailModel,
  ProjectListModel,
  CashParty,
  ProjectList,
} from "../models/sales-order.model";

@Injectable({
  providedIn: "root",
})
export class SalesOrderService {
  _api_URL = environment.baseAPI;
  cashPartyList: CashParty[] = [];
  projectList: ProjectList[] = [];

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getCashPartyAccount();
    this.getProjectList();
  }

  getCashPartyAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: any) => {
        this.cashPartyList = response.Entity;
      });
  }
  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectListModel) => {
        this.projectList = response.Entity;
      });
  }
  getSalesOrderMaster(body): Observable<SalesOrderNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}SalesOrderMaster/navigate`,
      body
    );
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
