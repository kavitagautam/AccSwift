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
import {
  ProductMin,
  ProductMinRootModel,
} from "@app/modules/product/models/product-min.model";

@Injectable({
  providedIn: "root",
})
export class SalesInvoiceService {
  _api_URL = environment.baseAPI;
  seriesList: Series[] = [];
  projectList: Project[] = [];
  cashPartyList: CashParty[] = [];
  productList: ProductMin[] = [];
  salesAccountList: SalesAccounts[] = [];
  depotList: Depot[] = [];
  taxList: Tax[] = [];
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getSeriesList();
    this.getProjectList();
    this.getProductList();
    this.getSalesAccount();
    this.getCashPartyAccount();
    this.getDepotList();
    this.getTaxList();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SALES");
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

  getProductList(): void {
    this.httpService
      .get(`${this._api_URL}Product/min`)
      .subscribe((response: any) => {
        this.productList = response.Entity;
      });
  }

  getDepotList(): void {
    this.httpService
      .get(`${this._api_URL}Depot`)
      .subscribe((response: DepotModel) => {
        this.depotList = response.Entity;
      });
  }

  getTaxList(): void {
    this.httpService
      .get(`${this._api_URL}Tax/min`)
      .subscribe((response: TaxModel) => {
        this.taxList = response.Entity;
      });
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectRootModel) => {
        this.projectList = response.Entity;
      });
  }

  getCashPartyAccountDD(): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/cashparty`);
  }

  getProductDD(): Observable<ProductMinRootModel> {
    return this.httpService.get(`${this._api_URL}Product/min`);
  }

  getVoucherNoWithSeriesChange(seriesId): Observable<any> {
    const params = new HttpParams().set("SeriesID", seriesId);
    return this.httpService.get(
      `${this._api_URL}Series/VoucherNo`,
      null,
      params
    );
  }

  getRelatedUnits(id: any): Observable<RelatedUnitModel> {
    return this.httpService.get(
      `${this._api_URL}CompoundUnit/RelatedUnits/${id}`
    );
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
}
