import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ProductGroupTree,
  ProductModel,
  ProductGroup,
  AccountClassModel,
  AccountClass
} from "../models/product.models";
import { DepotList } from "@app/modules/depot/models/depot.model";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  _api_URL = environment.baseAPI;
  productGroupList: ProductGroup;
  accountClass: AccountClass;
  depotList: DepotList;
  unitList;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProductGroup();
    this.getDepotList();
    this.getUnitList();
    this.getAccountClass();
  }

  getProductTree(): Observable<ProductGroupTree> {
    return this.httpService.get(`${this._api_URL}ProductGroup/Tree`);
  }

  getProductList(): Observable<ProductModel> {
    return this.httpService.get(`${this._api_URL}Product`);
  }

  getProductDetails(id): Observable<ProductModel> {
    return this.httpService.get(`${this._api_URL}Product/${id}`);
  }

  //add Product Group
  addProduct(value): Observable<any> {
    return this.httpService.post(`${this._api_URL}Product`, value);
  }

  updateProduct(value): Observable<any> {
    return this.httpService.put(`${this._api_URL}Product`, value);
  }

  // get Product Group DropDown
  getProductGroup(): void {
    this.httpService.get(`${this._api_URL}ProductGroup`).subscribe(response => {
      this.productGroupList = response.Entity;
    });
  }

  getAccountClass(): void {
    this.httpService.get(`${this._api_URL}AccountClass`).subscribe(response => {
      this.accountClass = response.Entity;
    });
  }

  // get Product Group DropDown
  getDepotList(): void {
    this.httpService.get(`${this._api_URL}Depot`).subscribe(response => {
      this.depotList = response.Entity;
    });
  }

  getUnitList(): void {
    this.httpService
      .get(`${this._api_URL}UnitMaintenance`)
      .subscribe(response => {
        this.unitList = response.Entity;
      });
  }

  deleteProductByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}Product/${id}`);
  }
}
