import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  ProjectListModel,
  AccountClassModel,
} from "../../stock-status/models/stock.models";
import { TransactionVoucherModel } from "../models/day-book.models";

@Injectable({
  providedIn: "root",
})
export class DayBookService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getDayBookData(body): Observable<any> {
    return this.httpService.post(
      `${this._api_URL}/Reports/DayBookReport`,
      body
    );
  }

  getProjectLists(): Observable<ProjectListModel> {
    return this.httpService.get(`${this._api_URL}project`);
  }

  getAccountClass(): Observable<AccountClassModel> {
    return this.httpService.get(`${this._api_URL}AccountClass`);
  }

  getVoucherType(): Observable<TransactionVoucherModel> {
    return this.httpService.get(`${this._api_URL}Utility/TransactVoucherType`);
  }
}
