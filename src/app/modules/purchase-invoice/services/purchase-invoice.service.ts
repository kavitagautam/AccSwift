import { HttpClientService } from "@core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  PurchaseInvoiceMaster,
  SeriesList,
  ProjectList,
} from "./../models/purchase-invoice.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseInvoiceService {
  _api_URL = environment.baseAPI;
  seriesList: SeriesList;
  projectList: ProjectList;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectList();
    this.getSeriesList();
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectList = res;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "PURCH"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesList = res;
      });
  }

  getPurchaseInvoiceMaster(): Observable<PurchaseInvoiceMaster[]> {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster`);
  }

  getPurchaseInvoiceDetails(id: any): Observable<PurchaseInvoiceMaster> {
    return this.httpService.get(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }

  deleteInvoiceById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}PurchaseInvoiceMaster/${id}`);
  }
}
