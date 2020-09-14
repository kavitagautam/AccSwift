import { HttpClientService } from "@core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  PurchaseInvoiceNavigateModel,
  PurchaseInvoiceDetailModel,
} from "./../models/purchase-invoice.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getPurchaseInvoiceMaster(body): Observable<PurchaseInvoiceNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}PurchaseInvoiceMaster/navigate`,
      body
    );
  }

  getPurchaseInvoiceDetails(id: any): Observable<PurchaseInvoiceDetailModel> {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }

  addPurchaseInvoice(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}PurchaseInvoiceMaster`, body);
  }

  updatePurchaseInvoice(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}PurchaseInvoiceMaster`, body);
  }

  deletePurchaseById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }
}
