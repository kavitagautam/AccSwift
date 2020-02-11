import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductGroupTree, ProductModel } from "../models/product.models";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

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
    const body = {
      ParentGroupID: value.ParentGroupID,
      Name: value.Name,
      Remarks: value.Remarks
    };
    return this.httpService.post(`${this._api_URL}Product`, body);
  }

  updateProduct(value): Observable<any> {
    const body = {
      ID: value.ID,
      ParentGroupID: value.ParentGroupID,
      Name: value.Name,
      Remarks: value.Remarks
    };
    return this.httpService.put(`${this._api_URL}Product`, body);
  }
}
