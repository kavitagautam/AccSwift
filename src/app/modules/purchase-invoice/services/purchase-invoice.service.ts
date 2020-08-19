import { HttpClientService } from "@core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  PurchaseInvoiceNavigateModel,
  PurchaseInvoiceDetailModel,
} from "./../models/purchase-invoice.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import {
  Tax,
  TaxModel,
} from "@accSwift-modules/accswift-shared/models/tax.model";
import { RelatedUnitModel } from "@accSwift-modules/accswift-shared/models/related-unit.model";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceService {
  _api_URL = environment.baseAPI;
  taxList: Tax[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getTaxList();
  }

  getTaxList(): void {
    this.httpService
      .get(`${this._api_URL}Tax/min`)
      .subscribe((response: TaxModel) => {
        this.taxList = response.Entity;
      });
  }
  getRelatedUnits(id: any): Observable<RelatedUnitModel> {
    return this.httpService.get(
      `${this._api_URL}CompoundUnit/RelatedUnits/${id}`
    );
  }
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
