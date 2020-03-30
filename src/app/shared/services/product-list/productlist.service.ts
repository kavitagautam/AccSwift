import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
export interface ProductList {
  GroupID: number;
  GroupName: string;
  PurchaseRate: number;
  SalesRate: number;
  ClosingQty: number;
  UnitID: number;
  IsInventory: boolean;
  ID: number;
  Name: string;
  Code: string;
}

export interface ProductListModel {
  StatusCode: number;
  Message: string;
  Entity: ProductList[];
}
@Injectable({
  providedIn: "root"
})
export class ProductlistService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProductList(): Observable<ProductListModel> {
    return this.httpService.get(`${this._api_URL}Product/LOP`);
  }
}
