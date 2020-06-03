import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TrailBalanceModel } from "../models/trail-balance.model";
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
} from "../models/sales.report.model";

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

  getGroupBalanceData(): Observable<TrailBalanceModel> {
    return this.httpService.get(`${this._api_URL}/Ledger/GroupBalance`);
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
}
