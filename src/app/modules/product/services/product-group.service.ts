import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import {
  ProductGroup,
  ProductGroupDetailModel,
} from "../models/product-group.models";

@Injectable({
  providedIn: "root",
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
  getProductGroupDetails(id): Observable<ProductGroupDetailModel> {
    return this.httpService.get(`${this._api_URL}ProductGroup/${id}`);
  }

  // get Product Group DropDown
  getProductGroup(): void {
    this.httpService
      .get(`${this._api_URL}ProductGroup`)
      .subscribe((response) => {
        this.productGroupList = response.Entity;
      });
  }

  //add Product Group
  addProductGroup(value): Observable<any> {
    const body = {
      ParentGroupID: value.ParentGroupID,
      Name: value.Name,
      Remarks: value.Remarks,
    };
    return this.httpService.post(`${this._api_URL}ProductGroup`, body);
  }

  updateProductGroup(value): Observable<any> {
    const body = {
      ID: value.ID,
      ParentGroupID: value.ParentGroupID,
      Name: value.Name,
      Remarks: value.Remarks,
    };
    return this.httpService.put(`${this._api_URL}ProductGroup`, body);
  }

  deleteProductGroupByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}ProductGroup/${id}`);
  }
}
