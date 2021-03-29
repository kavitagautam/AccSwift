import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { TrailBalanceModel } from "../models/trail-balance.model";
import { StockStatusReportsModel } from "../stock-status/models/stock.models";
import {
  SalesReportModel,
  CashPartyGroupModel,
  PurchaseReportModel,
} from "../models/sales.report.model";
import {
  LedgerReportsRootModel,
  LedgerReportSummaryRootModel,
} from "../models/ledger.reports.model";
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
import { Depot, DepotModel } from "@accSwift-modules/depot/models/depot.model";
import {
  SalesAccountModel,
  SalesAccounts,
} from "@accSwift-modules/accswift-shared/models/sales-account.model";
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
import {
  LedgerGroup,
  LedgerGroupModel,
} from "@accSwift-modules/ledger/models/ledger-group.model";
import {
  LedgerMin,
  LedgerMinModel,
} from "@accSwift-modules/ledger/models/ledger.models";
import { GroupBalanceRootModel } from "../models/group-balance.model";
import { LedgerTransactionRootModel } from "../models/ledger-transaction.model";
import {
  VoucherType,
  VoucherTypeModel,
} from "@accSwift-modules/accswift-shared/models/voucher-type.model";
import {
  PurchaseAccount,
  PurchaseAccountModel,
} from "@accSwift-modules/preference/models/preference.model";
import { CashFlowRootModel } from '../models/cash-flow.model';
import { KharidKhataRootModel } from '../models/kharid-khata.model';
import { BikriKhataRootModel } from '../models/bikri-khata.model';
import { MaterializedViewList, MaterializedViewRootModel } from '../models/materialized-view.model';

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  private projectName = new Subject<string>();
  projectName$ = this.projectName.asObservable();
  ledgerGroupLists: LedgerGroup[] = [];
  ledgerMinLists: LedgerMin[] = [];

  // Service message commands
  selectProject(name: string) {
    this.projectName.next(name);
  }

  _api_URL = environment.baseAPI;
  productList: ProductMin[] = [];
  productGroupList: ProductGroup[] = [];
  projectList: Project[] = [];
  accountLists: AccountClass[];
  transVoucherType: VoucherType[] = [];
  depotList: Depot[] = [];
  salesAccountList: SalesAccounts[] = [];
  purchaseAccountList: PurchaseAccount[] = [];
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
    this.getVoucherType();
    this.getSalesAccount();
    this.getPurchaseAccount();
    this.getDepotList();
    this.getLedgerGroupDropDown();
    this.getLedgerDropDown();
  }

  getTrailBalance(body): Observable<TrailBalanceModel> {
    return this.httpService.post(`${this._api_URL}/Reports/Trial`, body);
  }

  getGroupBalanceDetails(body): Observable<GroupBalanceRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/GroupBal
    `,
      body
    );
  }

  getLedgerTransactionDetails(body): Observable<LedgerTransactionRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/LedgerTransact`,
      body
    );
  }

  getLedgerReports(body): Observable<LedgerReportsRootModel> {
    return this.httpService.post(`${this._api_URL}Reports/LedgerReport`, body);
  }

  getLedgerSummaryReports(body): Observable<LedgerReportSummaryRootModel> {
    return this.httpService.post(`${this._api_URL}Reports/LedgerReport`, body);
  }

  getProductMin(): void {
    this.httpService
      .get(`${this._api_URL}/Product/min`)
      .subscribe((response: ProductMinRootModel) => {
        this.productList = response.Entity;
      });
  }

  getProductMinDD(): Observable<ProductMinRootModel> {
    return this.httpService.get(`${this._api_URL}/Product/min`);
  }

  getProductGroup(): void {
    this.httpService
      .get(`${this._api_URL}/ProductGroup`)
      .subscribe((response: ProductGroupModel) => {
        this.productGroupList = response.Entity;
      });
  }

  getProductGroupDD(): Observable<ProductGroupModel> {
    return this.httpService.get(`${this._api_URL}ProductGroup`);
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

  getCashFlowReports(body): Observable<CashFlowRootModel> {
    return this.httpService.post(
      `${this._api_URL}Reports/CashFlow`,
      body
    );
  }

  getKharidKhataReports(body): Observable<KharidKhataRootModel> {
    return this.httpService.post(`${this._api_URL}InventoryReports/KharidKhata`, body);
  }

  getBikriKhataReports(body): Observable<BikriKhataRootModel> {
    return this.httpService.post(`${this._api_URL}InventoryReports/BikriKhata`, body);
  }

  getMaterializedViewReports(body): Observable<MaterializedViewRootModel> {
    return this.httpService.post(`${this._api_URL}InventoryReports/MaterializedView`, body);
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

  getDepotList(): void {
    this.httpService
      .get(`${this._api_URL}Depot/min`)
      .subscribe((response: DepotModel) => {
        this.depotList = response.Entity;
      });
  }

  getSalesAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/salesAccounts`)
      .subscribe((response: SalesAccountModel) => {
        this.salesAccountList = response.Entity;
      });
  }
  getPurchaseAccount(): void {
    this.httpService
      .get(`${this._api_URL}Ledger/purchAccounts`)
      .subscribe((response: PurchaseAccountModel) => {
        this.purchaseAccountList = response.Entity;
      });
  }

  getLedgerMin(): Observable<LedgerMinModel> {
    return this.httpService.get(`${this._api_URL}Ledger/min`);
  }

  getLedgerGroup(): Observable<LedgerGroupModel> {
    return this.httpService.get(`${this._api_URL}LedgerGroup`);
  }

  getVoucherType(): void {
    this.httpService
      .get(`${this._api_URL}Utility/TransactVoucherType`)
      .subscribe((response: VoucherTypeModel) => {
        this.transVoucherType = response.Entity;
      });
  }

  getLedgerGroupDropDown(): void {
    this.httpService
      .get(`${this._api_URL}LedgerGroup`)
      .subscribe((response) => {
        this.ledgerGroupLists = response.Entity;
      });
  }
  getLedgerDropDown(): void {
    this.httpService.get(`${this._api_URL}Ledger/min`).subscribe((response) => {
      this.ledgerMinLists = response.Entity;
    });
  }
}
