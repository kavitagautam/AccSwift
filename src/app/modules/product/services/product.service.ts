import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Product,
  ProductGroupTree,
  ProductModel
} from "../models/product.models";
import { ProductGroupModel } from "../product-group/models/product-group.models";

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

  getProductDetails(id): Observable<Product> {
    return this.httpService.get(`${this._api_URL}Product/${id}`);
  }
}
