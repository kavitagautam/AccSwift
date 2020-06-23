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

export interface LedgerList {
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

export interface Company {
  ID: number;
  Name: string;
  Code: string;
  Address1: string;
  Address2: string;
  City: string;
  District: string;
  Zone: string;
  Telephone: string;
  Email: string;
  Website: string;
  POBox: string;
  PAN: string;
  Logo?: any;
  FYFrom: Date;
  BookBeginFrom: Date;
  FiscalYear: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy?: any;
  CreatedDate?: any;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface LedgerReports {
  Entity: LedgerList[];
  Company: Company;
}

export interface LedgerReportModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerReports;
}
