import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
export interface ProductList {
  ClosingQty: number;
  CodeName: string;
  GroupID: number;
  GroupName: string;
  IsInventory: boolean;
  IsVAT: boolean;
  ProductCode: string;
  ProductID: number;
  ProductName: string;
  PurchaseRate: number;
  QtyUnitID: number;
  SalesRate: number;
}

export interface ProductListModel {
  StatusCode: number;
  Message: string;
  Entity: ProductList[];
}
@Injectable({
  providedIn: "root",
})
export class ProductlistService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProductList(): Observable<ProductListModel> {
    return this.httpService.get(`${this._api_URL}Product/min`);
  }
}
