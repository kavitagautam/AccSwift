import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  CodeSuggestModel,
  LedgerDetailsModel,
  LedgerListViewModel,
  LedgerMin,
  LedgerMinModel,
} from "../models/ledger.models";
import { Observable } from "rxjs";
import {
  AccountClass,
  AccountClassModel,
} from "@accSwift-modules/accswift-shared/models/account-class.model";
import {
  LedgerGroupDetailsModel,
  LedgerGroup,
  LedgerGroupModel,
} from "../models/ledger-group.model";

@Injectable({
  providedIn: "root",
})
export class LedgerService {
  _api_URL = environment.baseAPI;
  ledgerGroupLists: LedgerGroup[] = [];
  accountClass: AccountClass[] = [];
  ledgerMinLists: LedgerMin[] = [];
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getLedgerGroupDropDown();
    this.getAccountClass();
  }

  getAccountClass(): void {
    this.httpService
      .get(`${this._api_URL}AccountClass`)
      .subscribe((response: AccountClassModel) => {
        this.accountClass = response.Entity;
      });
  }

  getLedgerTreeView(): any {
    return this.httpService.get(`${this._api_URL}LedgerGroup/Tree`);
  }

  getLedgerListView(): Observable<LedgerListViewModel> {
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
      `${this._api_URL}LedgerGroup/${ledgerGroupId}`
    );
  }

  addLedgerAccount(value): Observable<any> {
    return this.httpService.post(`${this._api_URL}Ledger`, value);
  }

  updateLedgerAccount(value): Observable<any> {
    return this.httpService.put(`${this._api_URL}Ledger`, value);
  }

  getLedgerDetails(ledgerId): Observable<LedgerDetailsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/${ledgerId}`);
  }

  deleteLedgerById(ledgerId): Observable<any> {
    return this.httpService.delete(`${this._api_URL}Ledger/${ledgerId}`);
  }

  getLedgerGroupDropDown(): void {
    this.httpService
      .get(`${this._api_URL}LedgerGroup`)
      .subscribe((response) => {
        this.ledgerGroupLists = response.Entity;
      });
  }

  getLedgerGroupList(): Observable<LedgerGroupModel> {
    return this.httpService.get(`${this._api_URL}LedgerGroup`);
  }

  getSuggestedCode(type): Observable<CodeSuggestModel> {
    const params = new HttpParams().set("type", type);
    return this.httpService.get(
      `${this._api_URL}Series/SuggestedCode`,
      null,
      params
    );
  }

  getLedgerDropDown(): void {
    this.httpService.get(`${this._api_URL}Ledger/min`).subscribe((response) => {
      this.ledgerMinLists = response.Entity;
    });
  }

  getLedgerMin(): Observable<LedgerMinModel> {
    return this.httpService.get(`${this._api_URL}Ledger/min`);
  }
}
