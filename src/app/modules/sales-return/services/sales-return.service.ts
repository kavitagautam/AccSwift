import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import {
  SalesReturnNavigateModel,
  SalesReturnDetailModel,
} from "../models/sales-return.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SalesReturnService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

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
