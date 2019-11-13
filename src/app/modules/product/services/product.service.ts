import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product, ProductGroup } from "../models/product.models";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProductTree() {
    return this.httpService.get(`${this._api_URL}ProductGroup/Tree`);
  }

  getProductList(): Observable<Product[]> {
    return this.httpService.get(`${this._api_URL}Product`);
  }

  getProductDetails(id): Observable<Product> {
    return this.httpService.get(`${this._api_URL}Product/${id}`);
  }

  getProductGroupDetails(id): Observable<ProductGroup> {
    return this.httpService.get(`${this._api_URL}ProductGroup/${id}`);
  }
}
