import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  _api_URL = environment.baseAPI;

  constructor(  private http: HttpClient,
    private httpService: HttpClientService) { }

    getLedgerTree() {
      return this.httpService.get(`${this._api_URL}Group/Tree`);
    }
}
