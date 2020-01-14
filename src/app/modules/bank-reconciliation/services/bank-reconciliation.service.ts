import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../../environments/environment";
import {
  SeriesList,
  ProjectList,
  BankReconciliationMaster
} from "./../components/models/bank-reconciliation.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BankReconciliationService {
  seriesLists: SeriesList;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  bankAccountLists;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }

  // getBankReceiptAccounts(): void {
  //   this.httpService
  //     .get(`${this._api_URL}Ledger/BankAccounts`)
  //     .subscribe((res: BankAccounts) => {
  //       this.bankAccountLists = res.Entity;
  //     });
  // }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_RECONCILIATION"); // Series List for bank Reconciliation V.Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }

  getBankReconciliationMaster(): Observable<BankReconciliationMaster[]> {
    return this.httpService.get(`${this._api_URL}BankReconciliationMaster`);
  }

  getBankReconciliationDetails(id): Observable<BankReconciliationMaster> {
    return this.httpService.get(
      `${this._api_URL}BankReconciliationMaster/${id}`
    );
  }
}
