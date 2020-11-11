import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@accSwift-modules/accswift-shared/models/series.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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
  projectList: Project[] = [];
  seriesList: Series[] = [];
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getSeriesList();
    this.getProjectLists();
  }

  getProductOrGroup(groupID): Observable<ProductOrGroupRootModel> {
    //const params = new HttpParams().set("id", groupID);
    return this.httpService.get(
      `${this._api_URL}Product/ProductGroupModel/${groupID}`
    );
  }

  getFavouriteItems(): Observable<ProductOrGroupRootModel> {
    return this.httpService.get(`${this._api_URL}Product/FavouriteItems`);
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "SALES");
    this.httpService
      .get(`${this._api_URL}Series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesList = response.Entity;
      });
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectRootModel) => {
        this.projectList = response.Entity;
      });
  }

  addSalesInvoice(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}SalesInvoiceMaster`, body);
  }

  getPDF(invoiceID): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = new HttpHeaders().set("content-type", "multipart/form-data");
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    return this.http.get(
      `${this._api_URL}SalesInvoiceMaster/PDFDownload/${invoiceID}`,
      { headers: headers, responseType: "blob" }
    );
  }
}
