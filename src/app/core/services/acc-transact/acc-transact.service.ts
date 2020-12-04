import { HttpClient } from '@angular/common/http';
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fields , FieldsRootModel} from "@app/modules/accswift-shared/models/acc-transact.model.ts";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class AccTransactService {
  lstfields: Fields[] = [];
  _api_URL = environment.baseAPI;

  constructor(private httpclient: HttpClient , 
    private httpService: HttpClientService) { }

  getfields(): Observable<FieldsRootModel>
  {
    return this.httpService.get(
      `${this._api_URL}AccTransactSummary`
    );
  }
  
}

