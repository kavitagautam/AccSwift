import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { BudgetMinListView, BudgetMinListViewRootModel, BudgetDetailsRootModel
} from "@accSwift-modules/budget/models/budget-model";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  _api_URL = environment.baseAPI;

  constructor(
    private httpclient: HttpClient,
    private httpService: HttpClientService
  ) {}

  getBudgetMinListView(): Observable<BudgetMinListViewRootModel> {
    return this.httpService.get(`${this._api_URL}Budget/min`);
  }

  addBudget(value): Observable<BudgetDetailsRootModel> {
    return this.httpService.post(`${this._api_URL}Budget`, value);
  }

  updateBudget(value): Observable<BudgetDetailsRootModel> {
    return this.httpService.put(`${this._api_URL}Budget`, value);
  }

  getBudgetDetails(id): Observable<BudgetDetailsRootModel> {
    return this.httpService.get(`${this._api_URL}Budget/${id}`);
  }
}
