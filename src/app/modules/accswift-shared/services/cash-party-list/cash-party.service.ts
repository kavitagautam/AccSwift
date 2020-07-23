import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { CashPartyGridModel } from "../../models/cash-party.model";

@Injectable({
  providedIn: "root",
})
export class CashPartyService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getCashPartyList(body): Observable<CashPartyGridModel> {
    return this.httpService.post(
      `${this._api_URL}Ledger/navigate/cashparty`,
      body
    );
  }
}
