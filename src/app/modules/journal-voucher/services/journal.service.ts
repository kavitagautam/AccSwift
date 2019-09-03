import { Injectable } from '@angular/core';
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
  _api_URL = environment.baseAPI;
  constructor(private http: HttpClient,
    private httpService: HttpClientService) { }

  getMasterJournal() {
    // return  this.httpService.get(`${this._api_URL}journalmaster`).subscribe((res) => {
    //     console.log(res);
    //     return res
    //   });
    return this.httpService.get(`${this._api_URL}journalmaster`);
  }
}
