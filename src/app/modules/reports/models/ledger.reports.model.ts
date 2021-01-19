import { Company } from "@accSwift-modules/company/models/company.model";

export interface SubLedgerDetail {
  TransactDate?: any;
  VoucherNo: string;
  VoucherType: string;
  Balance?: any;
  Type: string;
  Remarks?: any;
  RowID?: any;
  DebitAmount: number;
  CreditAmount: number;
  ID: number;
  AccountCode: string;
  AccountName: string;
}

export interface TransactDetail {
  SubLedgerDetails: SubLedgerDetail[];
  TransactDate: Date;
  VoucherNo: string;
  VoucherType: string;
  Balance: string;
  Type: string;
  Remarks: string;
  RowID: number;
  DebitAmount: number;
  CreditAmount: number;
  ID: number;
  AccountCode?: any;
  AccountName: string;
}

export interface LedgerReport {
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

export interface LedgerReportsModel {
  Entity: LedgerReport[];
  TotalDebitAmount?: any;
  TotalCreditAmount?: any;
  ClosingBalance?: any;
  Company: Company;
}

export interface LedgerReportsRootModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerReportsModel;
}

export interface LedgerReportSummery {
  Type: string;
  Opening: string;
  CrDrDiffBalance: string;
  FinalBalance: string;
  DebitAmount: number;
  CreditAmount: number;
  ID: number;
  AccountCode?: any;
  AccountName: string;
}

export interface LedgerReportSummaryModel {
  Entity: LedgerReportSummery[];
  TotalDebitAmount: number;
  TotalCreditAmount: number;
  ClosingBalance: string;
  Company: Company;
}

export interface LedgerReportSummaryRootModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerReportSummaryModel;
}
