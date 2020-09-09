import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  JournalMasterRootModel,
  JournalEditModel,
} from "../models/journal.model";

@Injectable({
  providedIn: "root",
})
export class JournalService {
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getJournalDetails(id): Observable<JournalEditModel> {
    return this.httpService.get(`${this._api_URL}journalmaster/${id}`);
  }

  addJournalVoucher(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}JournalMaster`, body);
  }

  updateJournalVoucher(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}JournalMaster`, body);
  }

  getJournalList(body): Observable<JournalMasterRootModel> {
    return this.httpService.post(
      `${this._api_URL}JournalMaster/Navigate`,
      body
    );
  }

  deleteJournal(id): Observable<any> {
    return this.http.delete(`${this._api_URL}journalmaster/${id}`);
  }
}
