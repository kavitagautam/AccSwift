import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  SeriesList,
  BankAccounts,
  ProjectListModel,
  BankPaymentNavigateModel,
  BankPaymentDetailModel,
  ProjectList,
} from "../models/bank-payment.model";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";

@Injectable({
  providedIn: "root",
})
export class BankPaymentService {
  _api_URL = environment.baseAPI;
  projectList: ProjectList[] = [];
  seriesList: SeriesList;
  bankAccountList: BankAccounts;

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
      .subscribe((res: ProjectListModel) => {
        this.projectList = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_PMNT"); // Series List for Bank Payment Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res) => {
        this.seriesList = res.Entity;
      });
  }
  getBankPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/BankAccounts`)
      .subscribe((res) => {
        this.bankAccountList = res.Entity;
      });
  }

  getBankPaymentMaster(body): Observable<BankPaymentNavigateModel> {
    return this.httpService.post(
      `${this._api_URL}BankPaymentMaster/navigate`,
      body
    );
  }

  getBankPaymentDetails(id): Observable<BankPaymentDetailModel> {
    return this.httpService.get(`${this._api_URL}BankPaymentMaster/${id}`);
  }

  updateBankPayment(body): Observable<any> {
    return this.httpService.put(`${this._api_URL}BankPaymentMaster`, body);
  }

  addBankPayment(body): Observable<any> {
    return this.httpService.post(`${this._api_URL}BankPaymentMaster`, body);
  }

  deleteBankPaymentByID(id): Observable<any> {
    return this.http.delete(`${this._api_URL}BankPaymentMaster/${id}`);
  }
}
