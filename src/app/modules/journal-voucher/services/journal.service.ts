import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { JournalMaster } from '../models/journal.model';
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

  getMasterJournal() {
    return this.httpService.get(`${this._api_URL}journalmaster`);
  }
  getJournalDetails(id) {
    return this.httpService.get(`${this._api_URL}journalmaster/${id}`);
  }
  getProjectLists() {
    this.httpService.get(`${this._api_URL}project`).subscribe((c => {
      this.projectLists = c;
    }));
  }
  getSeriesList() {
    this.httpService.get(`${this._api_URL}series/journal`).subscribe((c => {
      this.journalSeriesList = c;
    }));
  }

  getLedgerList(){
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }

}
