import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import {
  PurchaseOrderDetailModel,
  PurchaseOrderNavigateModel,
} from "../models/purchase-order.model";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import { CashParty } from "@accSwift-modules/accswift-shared/models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class PurchaseOrderService {
  _api_URL = environment.baseAPI;
  projectList: Project[] = [];
  cashPartyList: CashParty[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getCashPartyAccount();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectList = res.Entity;
      });
  }

  getCashPartyAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/cashparty`)
      .subscribe((response: any) => {
        this.cashPartyList = response.Entity;
      });
  }

  getPurchaseOrderMaster(body): Observable<PurchaseOrderNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}PurchaseOrderMaster/navigate`,
      body
    );
  }

  getPurchaseOrderDetails(id: any): Observable<PurchaseOrderDetailModel> {
    return this.httpService.get(`${this._api_URL}PurchaseOrderMaster/${id}`);
  }

  addPurchaseOrder(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}PurchaseOrderMaster`, body);
  }

  updatePurchaseOrder(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}PurchaseOrderMaster`, body);
  }

  deletePurchaseById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}PurchaseOrderMaster/${id}`);
  }
}
