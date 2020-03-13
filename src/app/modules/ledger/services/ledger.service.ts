import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import {
  GroupDetails,
  LedgerDetailsModel,
  LedgerListModel
} from "../models/ledger.models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LedgerService {
  _api_URL = environment.baseAPI;
  groupList: any = [];
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getGroup();
  }
  getLedgerTreeView(): any {
    return this.httpService.get(`${this._api_URL}LedgerGroup/Tree`);
  }
  getLedgerListView(): Observable<LedgerListModel> {
    return this.httpService.get(`${this._api_URL}Ledger/ListView`);
  }

  getGroup() {
    this.httpService.get(`${this._api_URL}Group`).subscribe(res => {
      this.groupList = res;
    });
  }

  getGroupDetails(groupId): Observable<GroupDetails> {
    return this.httpService.get(`${this._api_URL}Group/${groupId}`);
  }

  getLedgerDetails(ledgerId): Observable<LedgerDetailsModel> {
    return this.httpService.get(`${this._api_URL}Ledger/${ledgerId}`);
  }

  deleteLedgerById(ledgerId): Observable<any> {
    return this.httpService.delete(`${this._api_URL}Legder/${ledgerId}`);
  }
}
