import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  SalesOrderNavigateModel,
  SalesOrderDetailModel,
} from "../models/sales-order.model";

@Injectable({
  providedIn: "root",
})
export class SalesOrderService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

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
