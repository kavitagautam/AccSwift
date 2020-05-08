import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { SeriesListModel, ProjectListModel } from "../models/forms-data.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormsService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getSeriesList(voucherType): Observable<SeriesListModel> {
    const params = new HttpParams().set("VoucherType", voucherType);
    return this.httpService.get(`${this._api_URL}Series`, null, params);
  }

  getProjectLists(): Observable<ProjectListModel> {
    return this.httpService.get(`${this._api_URL}project`);
  }
}