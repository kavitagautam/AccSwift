import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  JournalMasterRootModel,
  JournalEditModel,
} from "../models/journal.model";

import {
  Series,
  SeriesRootModel,
} from "@accSwift-modules/accswift-shared/models/series.model";

@Injectable({
  providedIn: "root",
})
export class JournalService {
  journalSeriesList: Series[] = [];
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getSeriesList();
  }

  getJournalDetails(id): Observable<JournalEditModel> {
    return this.httpService.get(`${this._api_URL}journalmaster/${id}`);
  }

  addJournalVoucher(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}JournalMaster`, body);
  }

  updateJournalVoucher(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}JournalMaster`, body);
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "JRNL");
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.journalSeriesList = response.Entity;
      });
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
