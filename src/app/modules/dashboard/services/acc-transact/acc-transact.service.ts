import { HttpClient } from '@angular/common/http';
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fields , FieldsRootModel} from "@accSwift-modules/dashboard/models/acc-transact.model";
import { Account , AccountRootModel} from "@accSwift-modules/dashboard/models/acc-watchlist.model";
import { Items , ItemsRootModel} from "@accSwift-modules/dashboard/models/inv-transact.model";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class AccTransactService {
  fields: Fields[] = [];
  accounts: Account[] = [];
  items: Items[] = [];
  _api_URL = environment.baseAPI;

  constructor(private httpclient: HttpClient , 
    private httpService: HttpClientService) { }

  getfields(): Observable<FieldsRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}AccTransactSummary`
    );
  }

  getaccounts(): Observable<AccountRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}AccountSummary`
    );
  }

  getitems(): Observable<ItemsRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}InvTransactSummary`
    );
  }
  
}

