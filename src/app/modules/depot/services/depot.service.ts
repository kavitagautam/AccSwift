import { DepotDetailsModel, DepotRootModel } from "./../models/depot.model";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DepotService {
  api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getDepotList(body): Observable<DepotRootModel> {
    return this.httpService.post(`${this.api_URL}Depot/navigate`, body);
  }

  saveDepot(body): Observable<any> {
    return this.httpService.post(`${this.api_URL}Depot`, body);
  }

  updateDepot(body): Observable<any> {
    return this.httpService.put(`${this.api_URL}Depot`, body);
  }

  deleteDepotById(id): Observable<any> {
    return this.http.delete(`${this.api_URL}Depot/ ${id}`);
  }

  getDepotDetails(id): Observable<DepotDetailsModel> {
    return this.httpService.get(`${this.api_URL}Depot/${id}`);
  }
}
