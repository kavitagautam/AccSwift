import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { BudgetMinListView, BudgetMinListViewRootModel
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
}
