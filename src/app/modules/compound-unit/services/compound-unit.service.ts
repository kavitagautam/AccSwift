import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { CompoundUnitModel } from "./../models/compound.model";
@Injectable({
  providedIn: "root"
})
export class CompoundUnitService {
  _api_URL = environment.baseAPI;
  compoundUnitList;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getUnitDropDown();
  }

  getCompoundUnitList(body): Observable<CompoundUnitModel> {
    return this.httpService.post(`${this._api_URL}CompoundUnit/navigate`, body);
  }

  saveCompoundUnit(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}CompoundUnit`, body);
  }

  getUnitDropDown(): void {
    this.httpService
      .get(`${this._api_URL}UnitMaintenance`)
      .subscribe(response => {
        this.compoundUnitList = response.Entity;
      });
  }

  updateCompoundUnit(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}CompoundUnit`, body);
  }

  deleteCompoundUnitByID(id): Observable<any> {
    return this.http.delete(`${this._api_URL}CompoundUnit/${id}`);
  }
}
