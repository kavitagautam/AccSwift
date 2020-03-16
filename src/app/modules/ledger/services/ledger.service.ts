import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import {
  LedgerGroupDetailsModel,
  LedgerDetailsModel,
  LedgerListModel,
  LedgerGroup,
  AccountClass
} from "../models/ledger.models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LedgerService {
  _api_URL = environment.baseAPI;
  ledgerGroupLists: LedgerGroup[] = [];
  accountClass: AccountClass;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getLedgerGroupDropDown();
    this.getAccountClass();
  }

  getAccountClass(): void {
    this.httpService.get(`${this._api_URL}AccountClass`).subscribe(response => {
      this.accountClass = response.Entity;
    });
  }

  getLedgerTreeView(): any {
    return this.httpService.get(`${this._api_URL}LedgerGroup/Tree`);
  }
  getLedgerListView(): Observable<LedgerListModel> {
    return this.httpService.get(`${this._api_URL}Ledger/ListView`);
  }

  getLedgerGroupDetails(groupId): Observable<LedgerGroupDetailsModel> {
    return this.httpService.get(`${this._api_URL}LedgerGroup/${groupId}`);
  }

  addLedgerGroup(value): Observable<any> {
    return this.httpService.post(`${this._api_URL}LedgerGroup`, value);
  }

  updateLedgerGroup(value): Observable<any> {
    return this.httpService.put(`${this._api_URL}LedgerGroup`, value);
  }

  deleteLedgerGroupByID(ledgerGroupId): Observable<any> {
    return this.httpService.delete(
      `${this._api_URL}LegderGroup/${ledgerGroupId}`
    );
  }

  getLedgerDetails(ledgerId): Observable<LedgerDetailsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/${ledgerId}`);
  }

  deleteLedgerById(ledgerId): Observable<any> {
    return this.httpService.delete(`${this._api_URL}Legder/${ledgerId}`);
  }

  getLedgerGroupDropDown(): void {
    this.httpService.get(`${this._api_URL}LedgerGroup`).subscribe(response => {
      this.ledgerGroupLists = response.Entity;
    });
  }
}
