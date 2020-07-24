import { Company } from "@accSwift-modules/company/models/company.model";

export interface ProfitLossLists {
  Level: number;
  RowID?: any;
  AccountName: string;
  Amount?: number;
  ID?: number;
  Type: string;
  Category: number;
}

export interface ProfitLossModel {
  Entity: ProfitLossLists[];
  Company: Company;
}

export interface ProfitLossRootModel {
  StatusCode: number;
  Message: string;
  Entity: ProfitLossModel;
}

export interface GroupDetailList {
  Type: string;
  ID: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface ProfitLossGDModel {
  Entity: GroupDetailList[];
  ClosingBalance: string;
  Company: Company;
}

export interface ProfitLossGDRootModel {
  StatusCode: number;
  Message: string;
  Entity: ProfitLossGDModel;
}

export interface LedgerDetailList {
  TransactDate?: Date;
  VoucherNo: string;
  VoucherType: string;
  Balance: string;
  Type: string;
  Remarks: string;
  RowID?: number;
  ID?: number;
  AccountCode?: any;
  AccountName: string;
  DebitAmount?: number;
  CreditAmount?: number;
}

export interface ProfitLossLDModel {
  Entity: LedgerDetailList[];
  TotalDebitAmount?: any;
  TotalCreditAmount?: any;
  ClosingBalance?: any;
  Company: Company;
}

export interface ProfitLossLDRootModel {
  StatusCode: number;
  Message: string;
  Entity: ProfitLossLDModel;
}
