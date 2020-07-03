export interface BalanceSheet {
  Category: number;
  Level: number;
  Type: string;
  ID?: number;
  AccountName: string;
  Amount?: number;
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

export interface Ledger {
  TransactDate?: Date;
  VoucherNo?: any;
  VoucherType?: any;
  Balance: string;
  Type: string;
  Remarks?: any;
  RowID?: any;
  ID?: any;
  AccountCode?: any;
  AccountName: string;
  DebitAmount?: any;
  CreditAmount?: any;
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
