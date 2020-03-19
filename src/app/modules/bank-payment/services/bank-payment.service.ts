import { ProjectList } from "./../../journal-voucher/models/journal.model";
import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BankPaymentMaster,
  SeriesList,
  BankAccounts
} from "../models/bank-payment.model";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class BankPaymentService {
  _api_URL = environment.baseAPI;
  projectList: ProjectList;
  seriesList;
  bankAccountList;

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectList();
    this.getSeriesList();
    this.getBankPaymentAccounts();
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectList = res;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_PMNT"); // Series List for Bank Payment Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesList = res.Entity;
      });
  }
  getBankPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/BankAccounts`)
      .subscribe((res: BankAccounts) => {
        this.bankAccountList = res.Entity;
      });
  }

  getBankPaymentMaster(): Observable<BankPaymentMaster[]> {
    return this.httpService.get(`${this._api_URL}BankPaymentMaster`);
  }

  getBankPaymentDetails(id): Observable<BankPaymentMaster> {
    return this.httpService.get(`${this._api_URL}BankPaymentMaster/${id}`);
  }
}
