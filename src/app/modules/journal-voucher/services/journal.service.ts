import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  ProjectList,
  SeriesList,
  JournalNavigateModel,
  JournalDetailsModel
} from "../models/journal.model";

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
  ) {
    this.getProjectLists();
    this.getSeriesList();
  }

  getMasterJournal(): Observable<JournalNavigateModel[]> {
    return this.httpService.get(`${this._api_URL}journalmaster`);
  }
  getJournalDetails(id): Observable<JournalDetailsModel> {
    return this.httpService.get(`${this._api_URL}journalmaster/${id}`);
  }
  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }

  // getSeriesList(): void {
  //   const params = new HttpParams().set("VoucherType", "CASH_RCPT"); // Series List for Cash Receipt Voucher Type
  //   this.httpService
  //     .get(`${this._api_URL}series`, null, params)
  //     .subscribe((res: any) => {
  //       this.seriesLists = res.Entity;
  //       console.log(this.seriesLists);
  //     });

  getSeriesList(): void {
    const params = new HttpParams().set("VouchetType", "JRNL");
    this.httpService
      .get(`${this._api_URL}series/journal`, null, params)
      .subscribe((res: any) => {
        this.journalSeriesList = res.Entity;
        console.log(res);
      });
  }

  getJournalList(body): Observable<JournalNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}JournalMaster/Navigate`,
      body
    );
  }

  deleteJournal(id): Observable<any> {
    return this.http.delete(`${this._api_URL}journalmaster/${id}`);
  }
}
