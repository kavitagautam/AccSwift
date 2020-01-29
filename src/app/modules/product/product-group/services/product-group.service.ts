import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { ProductGroupModel } from "../models/product-group.models";
import { ProductGroup } from "../../models/product.models";

@Injectable({
  providedIn: "root"
})
export class ProductGroupService {
  _api_URL = environment.baseAPI;
  productGroupList: ProductGroup;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProductGroup();
  }

  // Api for Product Group
  getProductGroupDetails(id): Observable<ProductGroupModel> {
    return this.httpService.get(`${this._api_URL}ProductGroup/${id}`);
  }

  // get Product Group DropDown
  getProductGroup(): void {
    this.httpService.get(`${this._api_URL}ProductGroup`).subscribe(response => {
      this.productGroupList = response.Entity;
    });
  }

  //add Product Group
  addProductGroup(value): Observable<any> {
    const obj = {
      ParentID: value.ParentID,
      EngName: value.EngName,
      Remarks: value.Remarks
    };
    console.log("obj" + JSON.stringify(obj));
    return this.httpService.post(`${this._api_URL}ProductGroup`, obj);
  }

  updateProductGroup(value): Observable<any> {
    const obj = {
      ID: value.ID,
      ParentID: value.ParentID,
      EngName: value.EngName,
      Remarks: value.Remarks
    };
    return this.httpService.put(`${this._api_URL}ProductGroup`, obj);
  }

  deleteProductGroupByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}ProductGroup/${id}`);
  }
}
