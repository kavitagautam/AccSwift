import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
export interface Product {
  GroupID: number;
  GroupName: string;
  PurchaseRate: number;
  SalesRate: number;
  ClosingQty: number;
  UnitID: number;
  IsInventory: boolean;
  IsVAT: boolean;
  ID: number;
  Name: string;
  Code: string;
}

export interface ProductCheckModel {
  StatusCode: number;
  Message: string;
  Entity: Product[];
}

@Injectable({
  providedIn: "root",
})
export class ProductCodeValidatorsService {
  _api_URL = environment.baseAPI;

  constructor(private http: HttpClient) {}

  checkProductCode(code): Observable<ProductCheckModel> {
    const params = new HttpParams().set("ProductCode", code);
    return this.http.get<ProductCheckModel>(`${this._api_URL}CheckProduct`, {
      params,
    });
  }

  productCodeMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkProductCode(control.value).pipe(
        map(
          (res) => {
            if (control.value) {
              if (res.StatusCode == 200) {
                return null;
              } else {
                return {
                  codeUnMatch: true,
                };
              }
            } else {
              return null;
            }
          },
          (error) => {
            return Promise.resolve({
              codeUnMatch: true,
            });
          }
        )
      );
    };
  }
}
