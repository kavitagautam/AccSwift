import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SeriesList,
  ProjectList,
  CashPaymentMaster,
  LedgerList
} from "../models/cash-payment.model";

@Injectable({
  providedIn: "root"
})
export class CashPaymentService {
  seriesLists: SeriesList;
  cashAccountLists;
  projectLists: ProjectList;
  _api_URL = environment.baseAPI;
  cashPayment = [
    {
      IsPayByInvoice: false,
      TotalAmount: 1234.0,
      CashReceiptDetails: null,
      LedgerID: 20712,
      LedgerName: "Pt Cash",
      ID: 8,
      SeriesID: 282,
      SeriesName: "Main",
      VoucherNo: "00024",
      Date: "2019-01-10T00:00:00",
      ProjectID: 1,
      ProjectName: "All Project",
      Fields: { Field1: "", Field2: "", Field3: "", Field4: "", Field5: "" },
      Remarks: "",
      CreatedBy: "root",
      CreatedDate: "2019-01-10T00:00:00",
      ModifiedBy: "root",
      ModifiedDate: "2019-01-10T00:00:00"
    },
    {
      IsPayByInvoice: true,
      TotalAmount: 70.0,
      CashReceiptDetails: null,
      LedgerID: 20712,
      LedgerName: "Pt Cash",
      ID: 9,
      SeriesID: 282,
      SeriesName: "Main",
      VoucherNo: "00031",
      Date: "2019-01-11T00:00:00",
      ProjectID: 1,
      ProjectName: "All Project",
      Fields: { Field1: "", Field2: "", Field3: "", Field4: "", Field5: "" },
      Remarks: "",
      CreatedBy: "root",
      CreatedDate: "2019-01-11T00:00:00",
      ModifiedBy: "root",
      ModifiedDate: "2019-01-11T00:00:00"
    }
  ];

  constructor(
    private http: HttpClient,
    private httpService: HttpClientService
  ) {}

  init() {
    this.getProjectLists();
    this.getSeriesList();
  }

  getCashPayment() {
    return this.cashPayment;
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((res: ProjectList) => {
        this.projectLists = res;
      });
  }
  getSeriesList(): void {
    const params = new HttpParams().set("VoucherType", "CASH_PMNT"); // Series List for Cash Receipt Voucher Type
    this.httpService
      .get(`${this._api_URL}series`, null, params)
      .subscribe((res: SeriesList) => {
        this.seriesLists = res;
      });
  }

  getCashPaymentMaster(): Observable<CashPaymentMaster[]> {
    return this.http.get<CashPaymentMaster[]>(
      `${this._api_URL}CashPaymentMaster`
    );
  }

  getCashPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe(res => {
        this.cashAccountLists = res.Entity;
      });
  }

  getCashPaymentDetails(id): Observable<CashPaymentMaster> {
    return this.httpService.get(`${this._api_URL}CashPaymentMaster/${id}`);
  }

  getLedgerList(): Observable<LedgerList[]> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }
}
