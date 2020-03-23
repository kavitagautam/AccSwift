import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  CompanyDetailsModel,
  CompanyNavigateModel
} from "../models/company.model";

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  _api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getCompanyList(body): Observable<CompanyNavigateModel> {
    return this.httpService.post(`${this._api_URL}Company/navigate`, body);
  }

  getCompanyDetails(id): Observable<CompanyDetailsModel> {
    return this.httpService.get(`${this._api_URL}Company/${id}`);
  }

  addCompany(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}Company`, body);
  }

  updateCompany(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}Company`, body);
  }

  deleteCompanyById(id): Observable<any> {
    return this.http.delete(`${this._api_URL}Company/${id}`);
  }
}
