import { HttpClient } from '@angular/common/http';
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountTransact , AccountTransactRootModel , Account , AccountRootModel , InvTransact , InvTransactRootModel} from "@accSwift-modules/dashboard/models/dashboard-model.";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class AccTransactService {
  AccountTransactionList: AccountTransact[]=[];
  Accounts: Account[]=[];
  InvTransactionList: InvTransact[]=[];
  _api_URL = environment.baseAPI;

  constructor(private httpclient: HttpClient , 
    private httpService: HttpClientService) { }

  getAccountTransact(): Observable<AccountTransactRootModel>
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

  getInvTransact(): Observable<InvTransactRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}InvTransactSummary`
    );
  }
  
}

