import { DepotDetailsModel, DepotModel } from "./../models/depot.model";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DepotService {
  api_URL = environment.baseAPI;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  getDepotList(body): Observable<DepotModel> {
    return this.httpService.post(`${this.api_URL}Depot/navigate`, body);
  }

  saveDepot(value): Observable<any> {
    const obj = {
      DepotName: value.depot,
      City: value.city,
      Telephone: value.telephone,
      ContactPerson: value.contact,
      LicenceNo: value.license,
      DepotAddress: value.address,
      PostalCode: value.postalCode,
      Mobile: value.mobile,
      RegNo: value.regNo,
      Remarks: value.remarks
    };
    return this.httpService.post(`${this.api_URL}Depot`, obj);
  }

  updateDepot(value): Observable<any> {
    const obj = {
      ID: value.depotId,
      DepotName: value.depot,
      City: value.city,
      Telephone: value.telephone,
      ContactPerson: value.contact,
      LicenceNo: value.license,
      DepotAddress: value.address,
      PostalCode: value.postalCode,
      Mobile: value.mobile,
      RegNo: value.regNo,
      Remarks: value.remarks
    };
    return this.httpService.put(`${this.api_URL}Depot`, obj);
  }

  deleteDepotById(id): Observable<any> {
    return this.http.delete(`${this.api_URL}Depot/ ${id}`);
  }

  getDepotDetails(id): Observable<DepotDetailsModel> {
    return this.httpService.get(`${this.api_URL}Depot/${id}`);
  }
}
