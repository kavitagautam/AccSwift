import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  TrailBalanceModel,
  GroupBalanceModel,
  LedgerDetailsModel,
} from "../models/trail-balance.model";
import {
  ProductModel,
  ProductGroupModel,
  ProjectListModel,
  StockStatusReportsModel,
  AccountClassModel,
  Product,
  AccountClass,
  ProductGroup,
  ProjectList,
} from "../stock-status/models/stock.models";
import {
  SalesReportModel,
  CashPartyModel,
  CashPartyGroupModel,
  DepotModel,
  SalesAccountModel,
  PurchaseReportModel,
} from "../models/sales.report.model";
import {
  LedgerReportModel,
  LedgerMinModel,
} from "../models/ledger.reports.model";
import { LedgerGroupModel } from "@app/modules/ledger/models/ledger.models";
import {
  ProfitLossRootModel,
  ProfitLossLDRootModel,
  ProfitLossGDRootModel,
} from "../models/profit-loss.model";
import {
  BalanceSheetRootModel,
  BalanceSheetGDetailModel,
  BalanceSheetLDetailRootModel,
} from "../models/balance.sheet.model";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  _api_URL = environment.baseAPI;
  productList: Product[];
  productGroupList: ProductGroup[];
  projectList: ProjectList[] = [];
  accountLists: AccountClass[];
  monthList = [
    {
      name: "January",
      short: "Jan",
      number: 1,
    },
    {
      name: "February",
      short: "Feb",
      number: 2,
    },
    {
      name: "March",
      short: "Mar",
      number: 3,
    },
    {
      name: "April",
      short: "Apr",
      number: 4,
    },
    {
      name: "May",
      short: "May",
      number: 5,
    },
    {
      name: "June",
      short: "Jun",
      number: 6,
    },
    {
      name: "July",
      short: "Jul",
      number: 7,
    },
    {
      name: "August",
      short: "Aug",
      number: 8,
    },
    {
      name: "September",
      short: "Sep",
      number: 9,
    },
    {
      name: "October",
      short: "Oct",
      number: 10,
    },
    {
      name: "November",
      short: "Nov",
      number: 11,
    },
    {
      name: "December",
      short: "Dec",
      number: 12,
    },
  ];
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient
  ) {
    this.getProductMin();
    this.getProductGroup();
    this.getAccountClass();
    this.getProjectLists();
  }

  getTrailBalance(body): Observable<TrailBalanceModel> {
    return this.httpService.post(`${this._api_URL}/Reports/Trial`, body);
  }

  getTrailGroupDetails(body): Observable<GroupBalanceModel> {
    return this.httpService.post(`${this._api_URL}Reports/TrialDetails`, body);
  }

  getTrailLedgerDetails(body): Observable<LedgerDetailsModel> {
    return this.httpService.post(`${this._api_URL}Reports/TrialDetails`, body);
  }

  getLedgerReports(body): Observable<LedgerReportModel> {
    return this.httpService.post(`${this._api_URL}Reports/LedgerReport`, body);
  }

  getProductMin(): void {
    this.httpService
      .get(`${this._api_URL}/Product/min`)
      .subscribe((response: ProductModel) => {
        this.productList = response.Entity;
      });
  }

  getProductGroup(): void {
    this.httpService
      .get(`${this._api_URL}/ProductGroup`)
      .subscribe((response: ProductGroupModel) => {
        this.productGroupList = response.Entity;
      });
  }

  getProjectLists(): void {
    this.httpService
      .get(`${this._api_URL}project`)
      .subscribe((response: ProjectListModel) => {
        this.projectList = response.Entity;
      });
  }

  getAccountClass(): void {
    this.httpService
      .get(`${this._api_URL}AccountClass`)
      .subscribe((response: AccountClassModel) => {
        this.accountLists = response.Entity;
      });
  }

  stockStatusReports(body): Observable<StockStatusReportsModel> {
    return this.httpService.post(
      `${this._api_URL}InventoryReports/StockStatus`,
      body
    );
  }

  getSalesReports(body): Observable<SalesReportModel> {
    return this.httpService.post(
      `${this._api_URL}InventoryReports/Sales`,
      body
    );
  }

  getPurchaseReports(body): Observable<PurchaseReportModel> {
    return this.httpService.post(
      `${this._api_URL}InventoryReports/Purchase`,
      body
    );
  }

  getProfitLossReports(body): Observable<ProfitLossRootModel> {
    return this.httpService.post(`${this._api_URL}Reports/ProfitLoss`, body);
  }

  getBalanceSheetReports(body): Observable<BalanceSheetRootModel> {
    return this.httpService.post(`${this._api_URL}Reports/BalanceSheet`, body);
  }

  getBSGroupDetails(body): Observable<BalanceSheetGDetailModel> {
    return this.httpService.post(`${this._api_URL}Reports/BalanceSheet`, body);
  }

  getBSLedgerDetails(body): Observable<BalanceSheetLDetailRootModel> {
    return this.httpService.post(`${this._api_URL}Reports/BalanceSheet`, body);
  }

  getPLGroupDetails(body): Observable<ProfitLossGDRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/ProfitLossDetails`,
      body
    );
  }

  getPLLedgerDetails(body): Observable<ProfitLossLDRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/ProfitLossDetails`,
      body
    );
  }

  getCashParty(): Observable<CashPartyModel> {
    return this.httpService.get(`${this._api_URL}Ledger/cashparty`);
  }

  getCashPartyGroup(): Observable<CashPartyGroupModel> {
    return this.httpService.get(`${this._api_URL}LedgerGroup/CashPartyGroups`);
  }

  getDepotList(): Observable<DepotModel> {
    return this.httpService.get(`${this._api_URL}Depot/min`);
  }

  getSalesAccount(): Observable<SalesAccountModel> {
    return this.httpService.get(`${this._api_URL}Ledger/salesAccounts`);
  }

  getLedgerMin(): Observable<LedgerMinModel> {
    return this.httpService.get(`${this._api_URL}Ledger/min`);
  }

  getLedgerGroup(): Observable<LedgerGroupModel> {
    return this.httpService.get(`${this._api_URL}LedgerGroup`);
  }
}
