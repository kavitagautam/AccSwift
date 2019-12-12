import { CashPaymentMaster } from "./../models/cash-payments.model";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  ProjectList,
  SeriesList,
  LedgerList
} from "../models/cash-payments.model";
import { Observable } from "rxjs";
import { of } from "rxjs";
import {
  CashReceiptMaster,
  CashAccounts
} from "@app/modules/cash-receipts/models/cash-receipt.model";

@Injectable({
  providedIn: "root"
})
export class CashPaymentsService {
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

  getCashPaymentsMaster(): Observable<CashReceiptMaster[]> {
    return Observable.create(observer => {
      observer.next(this.cashPayment);
      observer.complete();
    });
  }

  getCashPaymentAccounts(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/CashAccounts`)
      .subscribe((res: CashAccounts) => {
        this.cashAccountLists = res.Entity;
      });
  }

  getLedgerList(): Observable<LedgerList[]> {
    return this.httpService.get(`${this._api_URL}ledger/lov`);
  }
}
