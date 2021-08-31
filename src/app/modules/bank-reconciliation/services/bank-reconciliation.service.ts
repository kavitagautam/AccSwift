import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import {
  SeriesRootModel,
  Series,
} from "@accSwift-modules/accswift-shared/models/series.model";
import {
  BankAccounts,
  BankAccountsModel,
} from "@accSwift-modules/accswift-shared/models/bank-account.model";
import { BankReconciliation, BankReconciliationRootModel } from "../models/bank-reconciliation.model";

@Injectable({
  providedIn: "root",
})
export class BankReconciliationService {
  seriesLists: Series[] = [];
  projectLists: Project[] = [];
  _api_URL = environment.baseAPI;
  bankAccountLists: BankAccounts[] = [];
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectLists();
    this.getSeriesList();
    this.getBankReconciliationAccounts();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectLists = res.Entity;
      });
  }

  getBankReconciliationAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/BankAccounts`)
      .subscribe((res: BankAccountsModel) => {
        this.bankAccountLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BRECON"); // Series List for bank Reconciliation V.Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesRootModel) => {
        this.seriesLists = res.Entity;
      });
  }

  getBankReconciliationMaster(body): Observable<BankReconciliationRootModel> {
    return this.httpService.post(`${this._api_URL}BankReconciliationMaster/navigate`, body);
  }

  getBankReconciliationDetails(id): Observable<BankReconciliation> {
    return this.httpService.get(
      `${this._api_URL}BankReconciliationMaster/${id}`
    );
  }

  addBankRec(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}BankReconciliationMaster`, body);
  }
}
