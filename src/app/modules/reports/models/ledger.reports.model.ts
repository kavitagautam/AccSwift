import { Company } from "@accSwift-modules/company/models/company.model";

export interface LedgerReports {
  Entity: LedgerList[];
  Company: Company;
}

export interface LedgerReportModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerReports;
}

export interface Entity2 {
  Type: string;
  Opening: string;
  CrDrDiffBalance: string;
  FinalBalance: string;
  ID: number;
  AccountCode?: any;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface Entity {
  Entity: Entity2[];
  TotalDebitAmount: number;
  TotalCreditAmount: number;
  ClosingBalance: string;
  Company: Company;
}

export interface RootObject {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface LedgerMinList {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface LedgerMinModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerMinList[];
}

export interface LedgerGroup {
  ID: number;
  LedgerCode: string;
  ParentGroupID?: number;
  Name: string;
  DrCr: string;
  IsBuiltIn: boolean;
  Remarks: string;
}

export interface LedgerGroupModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerGroup[];
}

export interface LedgerList {
  Type: string;
  Opening: string;
  CrDrDiffBalance: string;
  FinalBalance: string;
  ID: number;
  AccountCode?: any;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface LedgerReports {
  Entity: LedgerList[];
  TotalDebitAmount: number;
  TotalCreditAmount: number;
  ClosingBalance: string;
  Company: Company;
}

export interface LedgerReportModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerReports;
}

export interface TransactDetail {
  TransactDate: Date;
  VoucherNo: string;
  VoucherType: string;
  Balance: string;
  Type: string;
  Remarks: string;
  RowID: number;
  ID: number;
  AccountCode?: any;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface LedgerReportsD {
  AccountID: number;
  AccountName: string;
  OpeningDate: string;
  OpeningCr: number;
  OpeningDr: number;
  OpeningBalance: string;
  TransactDetails: TransactDetail[];
  TotalCr: number;
  TotalDr: number;
  ClosingBalance: string;
}

export interface LedgerReportDetail {
  Entity: LedgerReportsD[];
  TotalDebitAmount?: any;
  TotalCreditAmount?: any;
  ClosingBalance?: any;
  Company: Company;
}

export interface LedgerReportModelWithDetail {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}
