import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment.prod";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { LedgerLovModel } from "@app/modules/ledger/models/ledger.models";

@Injectable({
  providedIn: "root",
})
export class LedgerListService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getLedgerList(): Observable<LedgerLovModel> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }
}
