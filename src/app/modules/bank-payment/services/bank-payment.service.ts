import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BankPaymentNavigateModel,
  BankPaymentDetailModel,
} from "../models/bank-payment.model";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import {
  Series,
  SeriesRootModel,
} from "@accSwift-modules/accswift-shared/models/series.model";
import {
  BankAccounts,
  BankAccountsModel,
} from "@accSwift-modules/accswift-shared/models/bank-account.model";

@Injectable({
  providedIn: "root",
})
export class BankPaymentService {
  _api_URL = environment.baseAPI;
  projectList: Project[] = [];
  seriesList: Series[] = [];
  bankAccountList: BankAccounts[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {
    this.getProjectList();
    this.getSeriesList();
  }

  getProjectList(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectRootModel) => {
        this.projectList = res.Entity;
      });
  }

  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "BANK_PMNT"); // Series List for Bank Payment Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((response: SeriesRootModel) => {
        this.seriesList = response.Entity;
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

  getLedgerDetails(id): Observable<any> {
    return this.httpService.get(`${this._api_URL}Ledger/Balance/${id}`);
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
