import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subscriber } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  JournalMaster,
  ProjectList,
  SeriesList,
  LedgerList
} from "../models/journal.model";
import { LedgerMatch } from "../models/ledgerCodeMatch.model";

@Injectable({
  providedIn: "root"
})
export class JournalService {
  journalSeriesList: SeriesList;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
  }

  getMasterJournal(): Observable<JournalMaster[]> {
    return this.httpService.get(`${this._api_URL}journalmaster`);
  }
  getJournalDetails(id): Observable<JournalMaster> {
    return this.httpService.get(`${this._api_URL}journalmaster/${id}`);
  }
  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    this.httpService
      .get(`${this._api_URL}series/journal`)
      .subscribe((res: SeriesList) => {
        this.journalSeriesList = res;
      });
  }

  getLedgerList(): Observable<LedgerList[]> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }

  checkLedgerCode(code): Observable<LedgerMatch> {
    const params = new HttpParams().set("LedgerCode", code);
    return this.http.get<LedgerMatch>(`${this._api_URL}CheckLedger`, {
      params
    });
  }

  getJournalList(paramsData) {
    const params = new HttpParams()
      .set("PageNo", paramsData.PageNo)
      .set("DisplayRow", paramsData.DisplayRow)
      .set("Direction", paramsData.Direction)
      .set("OrderBy", paramsData.OrderBy)
      .set("SeriesID", paramsData.SeriesId ? paramsData.SeriesId : 284)
      .set("ProjectID", paramsData.ProjectId ? paramsData.ProjectId : 1)
      .set("VoucherNo", paramsData.VoucherNo)
      .set("JournalDate", paramsData.JournalDate);
    return this.httpService.get(
      `${this._api_URL}JournalMaster/Navigate`,
      null,
      params
    );
  }

  deleteJournal(id): Observable<any> {
    return this.http.delete(`${this._api_URL}journalmaster/${id}`);
  }
}
