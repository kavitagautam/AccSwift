import { HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import {
  PdfModel,
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
  vatRate: number;
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getVatRate();
  }

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

  getVatRate(): void {
    this.httpService
      .get(`${this._api_URL}Slabs/SalesVAT`)
      .subscribe((response) => {
        this.vatRate = response;
      });
  }

  getSalesInvoicePDF(invoiceID): Observable<PdfModel> {
    let headers = new HttpHeaders();
    // headers = headers.set("Accept", "application/pdf");
    headers = new HttpHeaders().set("content-type", "multipart/form-data");

    //headers: headers,
    return this.httpService.get(
      `${this._api_URL}SalesInvoiceMaster/PDF/${invoiceID}`
    );
  }

  getPDF(invoiceID): Observable<Blob> {
    //const options = { responseType: 'blob' }; there is no use of this
    let headers = new HttpHeaders();
    // headers = headers.set("Accept", "application/pdf");
    headers = new HttpHeaders().set("content-type", "multipart/form-data");
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    //return this.http.get(url, { headers: headers, responseType: "blob" });

    return this.http.get(
      `${this._api_URL}SalesInvoiceMaster/PDFDownload/${invoiceID}`,
      { headers: headers, responseType: "blob" }
    );
  }
}
