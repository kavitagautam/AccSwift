import { HttpParams } from "@angular/common/http";
import {
  SalesInvoiceDetailsModel,
  SalseInvoiceNavigateModel,
} from "../models/sales-invoice.model";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { CompanyDetailsModel } from "@accSwift-modules/company/models/company.model";

@Injectable({
  providedIn: "root",
})
export class SalesInvoiceService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {}

  getSalesInvoiceMaster(body): Observable<SalseInvoiceNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}SalesInvoiceMaster/navigate`,
      body
    );
  }

  getSalesInvoiceDetails(id: any): Observable<SalesInvoiceDetailsModel> {
    return this.httpService.get(`${this._api_URL}SalesInvoiceMaster/${id}`);
  }

  addSalesInvoice(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}SalesInvoiceMaster`, body);
  }

  updateSalesInvoice(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}SalesInvoiceMaster`, body);
  }

  deleteSalesById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}SalesInvoiceMaster/${id}`);
  }

  getCompanyDetails(): Observable<CompanyDetailsModel> {
    return this.httpService.get(`${this._api_URL}Company/User`);
  }
}
