import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TrailBalanceModel } from "../models/trail-balance.model";
import {
  ProductModel,
  ProductGroupModel,
  ProjectListModel,
  StockStatusReportsModel,
  AccountClassModel,
} from "../stock-status/models/stock.models";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getGroupBalanceData(): Observable<TrailBalanceModel> {
    return this.httpService.get(`${this._api_URL}/Ledger/GroupBalance`);
  }

  getProductMin(): Observable<ProductModel> {
    return this.httpService.get(`${this._api_URL}/Product/min`);
  }

  getProductGroup(): Observable<ProductGroupModel> {
    return this.httpService.get(`${this._api_URL}/ProductGroup`);
  }

  getProjectLists(): Observable<ProjectListModel> {
    return this.httpService.get(`${this._api_URL}project`);
  }

  getAccountClass(): Observable<AccountClassModel> {
    return this.httpService.get(`${this._api_URL}AccountClass`);
  }

  stockStatusReports(body): Observable<StockStatusReportsModel> {
    return this.httpService.post(
      `${this._api_URL}InventoryReports/StockStatus`,
      body
    );
  }
}
