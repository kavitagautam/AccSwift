import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  SeriesTreeViewModel,
  VoucherConfigurationModel,
} from "../models/configuration.model";
import { Observable } from "rxjs";
import { SeriesRootModel } from "@accSwift-modules/accswift-shared/models/series.model";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getSeriesTreeView(): Observable<SeriesTreeViewModel> {
    return this.httpService.get(`${this._api_URL}Series/TreeView`);
  }

  getVoucherConfigDetails(seriesId): Observable<VoucherConfigurationModel> {
    return this.httpService.get(`${this._api_URL}Series/${seriesId}`);
  }

  updateVoucherConfig(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}Series`, body);
  }

  getSeriesList(voucherType): Observable<SeriesRootModel> {
    const params = new HttpParams().set("VoucherType", voucherType);
    return this.httpService.get(`${this._api_URL}series`, null, params);
  }
}
