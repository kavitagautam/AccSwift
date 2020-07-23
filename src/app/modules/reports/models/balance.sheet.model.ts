import { Ledger } from "@app/modules/ledger/models/ledger.models";
import { Company } from "@app/modules/company/models/company.model";

export interface BalanceSheet {
  Category: number;
  Level: number;
  Type: string;
  ID?: number;
  AccountName: string;
  Amount?: number;
}

export interface BalanceSheetModel {
  Entity: BalanceSheet[];
  Company: Company;
}

export interface BalanceSheetRootModel {
  StatusCode: number;
  Message: string;
  Entity: BalanceSheetModel;
}

export interface GroupList {
  Type: string;
  ID: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface BalanceSheetGroupDetail {
  Entity: GroupList[];
  ClosingBalance: string;
  Company: Company;
}

export interface BalanceSheetGDetailModel {
  StatusCode: number;
  Message: string;
  Entity: BalanceSheetGroupDetail;
}

export interface BalanceSheetLedger {
  Entity: Ledger[];
  TotalDebitAmount?: any;
  TotalCreditAmount?: any;
  ClosingBalance?: any;
  Company: Company;
}

export interface BalanceSheetLDetailRootModel {
  StatusCode: number;
  Message: string;
  Entity: BalanceSheetLedger;
}
