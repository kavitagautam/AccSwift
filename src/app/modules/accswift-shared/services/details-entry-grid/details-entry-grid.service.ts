import { Injectable } from "@angular/core";
import { Tax, TaxModel } from "../../models/tax.model";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  ProductMinRootModel,
  ProductMin,
} from "@accSwift-modules/product/models/product-min.model";
import { RelatedUnitModel } from "../../models/related-unit.model";
import {
  LedgerMin,
  LedgerMinModel,
} from "@accSwift-modules/ledger/models/ledger.models";
import { VoucherType, VoucherTypeModel } from "../../models/voucher-type.model";

@Injectable({
  providedIn: "root",
})
export class DetailsEntryGridService {
  _api_URL = environment.baseAPI;
  productList: ProductMin[] = [];
  ledgerList: LedgerMin[] = [];
  voucherType: VoucherType[] = [];
  taxList: Tax[] = [];
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getTaxList();
    this.getProductList();
    this.getLedgerList();
    this.getVoucherType();
  }
  getTaxList(): void {
    this.httpService
      .get(`${this._api_URL}Tax/min`)
      .subscribe((response: TaxModel) => {
        this.taxList = response.Entity;
      });
  }

  getProductList(): void {
    this.httpService
      .get(`${this._api_URL}Product/min`)
      .subscribe((response: any) => {
        this.productList = response.Entity;
      });
  }

  getLedgerList(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/min`)
      .subscribe((response: any) => {
        this.ledgerList = response.Entity;
      });
  }

  getVoucherType(): void {
    this.httpService
      .get(`${this._api_URL}Utility/TransactVoucherType`)
      .subscribe((response: VoucherTypeModel) => {
        this.voucherType = response.Entity;
      });
  }

  getProductDD(): Observable<ProductMinRootModel> {
    return this.httpService.get(`${this._api_URL}Product/min`);
  }

  getLedgerDD(): Observable<LedgerMinModel> {
    return this.httpService.get(`${this._api_URL}Ledger/min`);
  }

  getRelatedUnits(id: any): Observable<RelatedUnitModel> {
    return this.httpService.get(
      `${this._api_URL}CompoundUnit/RelatedUnits/${id}`
    );
  }
}
