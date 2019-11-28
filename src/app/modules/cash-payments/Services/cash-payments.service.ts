import { SeriesList, ProjectList } from "./../models/cash-payments.model";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CashPaymentsService {
  seriesLists: SeriesList;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    this.httpService
      .get(`${this._api_URL}series/journal`)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }
  // : Observable<CashReceiptMaster[]>
  getCashReceiptMaster() {
    return this.httpService.get(`${this._api_URL}CashReceiptMaster`);
  }
}
