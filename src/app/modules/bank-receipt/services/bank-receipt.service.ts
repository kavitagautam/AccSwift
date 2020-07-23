import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  BankReceiptNavigateModel,
  BankReceiptEditModel,
} from "../models/bank-receipt.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Project,
  ProjectRootModel,
} from "@app/modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@app/modules/accswift-shared/models/series.model";
import {
  BankAccountsModel,
  BankAccounts,
} from "@app/modules/accswift-shared/models/bank-account.model";

@Injectable({
  providedIn: "root",
})
export class BankReceiptService {
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
    this.getBankReceiptAccounts();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectLists = res.Entity;
      });
  }

  getBankReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/BankAccounts`)
      .subscribe((res: BankAccountsModel) => {
        this.bankAccountLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_RCPT"); // Series List for bank Receipt V.Type
    this.httpService
      .get(`${this._api_URL}Series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesLists = response.Entity;
      });
  }

  getBankReceiptMaster(body): Observable<BankReceiptNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}BankReceiptMaster/navigate`,
      body
    );
  }

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
  }

  getBankReceiptDetails(id): Observable<BankReceiptEditModel> {
    return this.httpService.get(`${this._api_URL}BankReceiptMaster/${id}`);
  }

  addBankReceipt(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}BankReceiptMaster`, body);
  }

  updateBankReceipt(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}BankReceiptMaster`, body);
  }

  deleteBankReceiptByID(id): Observable<any> {
    return this.httpService.delete(`${this._api_URL}BankReceiptMaster/${id}`);
  }
}
