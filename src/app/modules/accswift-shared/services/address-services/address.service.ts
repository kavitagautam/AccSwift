import {
  Country,
  CountryRootModel,
  StateProvinceRootModel,
} from "@accSwift-modules/accswift-shared/models/address.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  countryList: Country[] = [];
  _api_URL = environment.baseAPI;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getCountry();
  }

  getCountryLists(): Observable<CountryRootModel> {
    return this.httpService.get(`${this._api_URL}Utility/Country`);
  }

  getCountry(): void {
    this.httpService
      .get(`${this._api_URL}Utility/Country`)
      .subscribe((response: CountryRootModel) => {
        this.countryList = response.Entity;
      });
  }

  getStateProvince(countryId): Observable<StateProvinceRootModel> {
    return this.httpService.get(
      `${this._api_URL}Utility/StateProvince/${countryId}`
    );
  }
}
