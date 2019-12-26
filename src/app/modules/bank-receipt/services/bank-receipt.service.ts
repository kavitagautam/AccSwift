import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  SeriesList,
  ProjectList,
  BankReceiptMaster,
  BankAccounts
} from "../models/bank-receipt.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BankReceiptService {
  seriesLists: SeriesList;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  bankAccountLists;
  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
    this.getBankReceiptAccounts();
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }

  getBankReceiptAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/BankAccounts`)
      .subscribe((res: BankAccounts) => {
        this.bankAccountLists = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_RCPT"); // Series List for bank Receipt V.Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }

  getBankReceiptMaster(): Observable<BankReceiptMaster[]> {
    return this.httpService.get(`${this._api_URL}BankReceiptMaster`);
  }

  getBankReceiptDetails(id): Observable<BankReceiptMaster> {
    return this.httpService.get(`${this._api_URL}BankReceiptMaster/${id}`);
  }
}
