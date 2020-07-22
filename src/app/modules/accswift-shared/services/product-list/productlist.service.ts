import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { ProductMinRootModel } from "@app/modules/product/models/product-min.model";

@Injectable({
  providedIn: "root",
})
export class ProductlistService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProductList(): Observable<ProductMinRootModel> {
    return this.httpService.get(`${this._api_URL}Product/min`);
  }
}
