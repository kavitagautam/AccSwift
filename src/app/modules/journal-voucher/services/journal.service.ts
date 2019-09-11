import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { JournalMaster, ProjectList, SeriesList, LedgerList } from '../models/journal.model';
import { CustomResponse } from "@app/shared/models/custom-response.model";


@Injectable({
  providedIn: 'root'
})
export class JournalService {
  journalSeriesList;
  projectLists;
  _api_URL = environment.baseAPI;
  constructor(private http: HttpClient,
    private httpService: HttpClientService) { }

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
    this.httpService.get(`${this._api_URL}project`).subscribe((res: ProjectList) => {
      this.projectLists = res;
    });
  }
  getSeriesList(): void {
    this.httpService.get(`${this._api_URL}series/journal`).subscribe((res: SeriesList) => {
      this.journalSeriesList = res;
    });
  }

  getLedgerList() :Observable<LedgerList[]>{
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }

}
