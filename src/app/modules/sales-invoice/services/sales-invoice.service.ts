import {
  SeriesList,
  SeriesListModel
} from "./../../bank-payment/models/bank-payment.model";
import { HttpParams } from "@angular/common/http";
import {
  ProjectList,
  SalesInvoiceDetailsModel,
  SalseInvoiceNavigateModel,
  SalesAccountModel,
  CashParty,
  SalesAccounts,
  DepotListModel,
  DepotList,
  RelatedUnitModel
} from "./../components/models/sales-invoice.model";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { CashAccountsModel } from "@app/modules/cash-receipt/models/cash-receipt.model";

@Injectable({
  providedIn: "root"
})
export class SalesInvoiceService {
  _api_URL = environment.baseAPI;
  seriesList: SeriesList[] = [];
  projectList: ProjectList;
  cashPartyList: CashParty[] = [];
  salesAccountList: SalesAccounts[] = [];
  depotList: DepotList[] = [];
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getSeriesList();
    this.getProjectList();
    this.getSalesAccount();
    this.getCashPartyAccount();
    this.getDepotList();
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SALES");
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesListModel) => {
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
      .subscribe((response: CashAccountsModel) => {
        this.cashPartyList = response.Entity;
      });
  }

  getDepotList(): void {
    this.httpService
      .get(`${this._api_URL}Depot`)
      .subscribe((response: DepotListModel) => {
        this.depotList = response.Entity;
      });
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectList) => {
        this.projectList = response;
      });
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
