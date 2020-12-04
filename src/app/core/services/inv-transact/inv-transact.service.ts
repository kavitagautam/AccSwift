import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from 'rxjs';
import { Items , ItemsRootModel} from "@app/modules/accswift-shared/models/inv-transact.model.ts";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class InvTransactService {

  lstitems: Items[] = [];
  _api_URL = environment.baseAPI;

  constructor(private httpclient: HttpClient , 
    private httpService: HttpClientService) { }

  getitems(): Observable<ItemsRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}InvTransactSummary`
    );
  }

}
