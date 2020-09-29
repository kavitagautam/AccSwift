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
import { StockStatusReportsModel } from "../stock-status/models/stock.models";
import {
  SalesReportModel,
  CashPartyGroupModel,
  PurchaseReportModel,
} from "../models/sales.report.model";
import { LedgerReportModel } from "../models/ledger.reports.model";
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
import {
  Project,
  ProjectRootModel,
} from "@accSwift-modules/accswift-shared/models/project.model";
import { CashPartyModel } from "@accSwift-modules/accswift-shared/models/cash-party.model";
import { DepotModel } from "@accSwift-modules/depot/models/depot.model";
import { SalesAccountModel } from "@accSwift-modules/accswift-shared/models/sales-account.model";
import {
  AccountClass,
  AccountClassModel,
} from "@accSwift-modules/accswift-shared/models/account-class.model";
import {
  ProductGroup,
  ProductGroupModel,
} from "@accSwift-modules/product/models/product-group.models";
import {
  ProductMinRootModel,
  ProductMin,
} from "@accSwift-modules/product/models/product-min.model";
import { LedgerGroupModel } from "@accSwift-modules/ledger/models/ledger-group.model";
import { LedgerMinModel } from "@accSwift-modules/ledger/models/ledger.models";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  _api_URL = environment.baseAPI;
  productList: ProductMin[] = [];
  productGroupList: ProductGroup[] = [];
  projectList: Project[] = [];
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
      .subscribe((response: ProductMinRootModel) => {
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
      .subscribe((response: ProjectRootModel) => {
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
    return this.httpService.post(
      `${this._api_URL}Reports/BalanceSheetDetails`,
      body
    );
  }

  getBSLedgerDetails(body): Observable<BalanceSheetLDetailRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/BalanceSheetDetails`,
      body
    );
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
