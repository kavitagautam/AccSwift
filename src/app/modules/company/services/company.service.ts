import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { CompanyList } from "../models/company.model";

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getCompanyList(): Observable<CompanyList[]> {
    return this.httpService.get(`${this._api_URL}Company`);
  }
  getCompanyDetails(id): Observable<CompanyList> {
    return this.httpService.get(`${this._api_URL}Company/${id}`);
  }

  addCompany(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}Company`, body);
  }

  deleteCompanyById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}Company/${id}`);
  }
}
