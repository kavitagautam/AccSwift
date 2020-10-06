import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ProductDetailModel,
  ProductRootModel,
  ProductTreeViewModel,
} from "../models/product.models";
import { Depot } from "@accSwift-modules/depot/models/depot.model";
import { AccountClass } from "@accSwift-modules/accswift-shared/models/account-class.model";
import {
  ProductGroup,
  ProductGroupModel,
} from "../models/product-group.models";
import { Tax } from "@accSwift-modules/accswift-shared/models/tax.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  _api_URL = environment.baseAPI;
  productGroupList: ProductGroup[] = [];
  accountClass: AccountClass[] = [];
  depotList: Depot[] = [];
  taxList: Tax[] = [];
  unitList;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProductGroup();
    this.getDepotList();
    this.getUnitList();
    this.getAccountClass();
    this.getTaxList();
  }

  getProductTree(): Observable<ProductTreeViewModel> {
    return this.httpService.get(`${this._api_URL}ProductGroup/Tree`);
  }

  getProductList(): Observable<ProductRootModel> {
    return this.httpService.get(`${this._api_URL}Product`);
  }

  getProductDetails(id): Observable<ProductDetailModel> {
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
    this.httpService
      .get(`${this._api_URL}ProductGroup`)
      .subscribe((response: ProductGroupModel) => {
        this.productGroupList = response.Entity;
      });
  }

  getAccountClass(): void {
    this.httpService
      .get(`${this._api_URL}AccountClass`)
      .subscribe((response) => {
        this.accountClass = response.Entity;
      });
  }

  // get Product Group DropDown
  getDepotList(): void {
    this.httpService.get(`${this._api_URL}Depot`).subscribe((response) => {
      this.depotList = response.Entity;
    });
  }

  getUnitList(): void {
    this.httpService
      .get(`${this._api_URL}UnitMaintenance`)
      .subscribe((response) => {
        this.unitList = response.Entity;
      });
  }

  getTaxList(): void {
    this.httpService.get(`${this._api_URL}Tax/min`).subscribe((response) => {
      this.taxList = response.Entity;
    });
  }

  deleteProductByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}Product/${id}`);
  }
}
