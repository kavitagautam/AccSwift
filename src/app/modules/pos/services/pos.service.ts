import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ProductOrGroupRootModel } from "../models/pos.model";

@Injectable({
  providedIn: "root",
})
export class PosService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getProductOrGroup(groupID): Observable<ProductOrGroupRootModel> {
    const params = new HttpParams().set("id", groupID);
    return this.httpService.get(
      `${this._api_URL}Product/ProductGroupModel`,
      null,
      params
    );
  }

  getFavouriteItems(): Observable<ProductOrGroupRootModel> {
    return this.httpService.get(`${this._api_URL}Product/FavouriteItems`);
  }
}
