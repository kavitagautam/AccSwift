import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DayBookService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getDayBookData(): Observable<any> {
    return this.httpService.get(`${this._api_URL}/Reports/DayBook`);
  }
}
