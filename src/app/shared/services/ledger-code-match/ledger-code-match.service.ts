import { Injectable } from "@angular/core";
import { environment } from "@env/environment.prod";
import { Observable } from "rxjs";
import { HttpParams, HttpClient } from "@angular/common/http";
import { LedgerMatchModel } from "@app/shared/models/ledgerCodeMatch.model";

@Injectable({
  providedIn: "root"
})
export class LedgerCodeMatchService {
  _api_URL = environment.baseAPI;

  constructor(private http: HttpClient) {}

  checkLedgerCode(code): Observable<LedgerMatchModel> {
    const params = new HttpParams().set("LedgerCode", code);
    return this.http.get<LedgerMatchModel>(`${this._api_URL}CheckLedger`, {
      params
    });
  }
}
