export interface Ledger {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  DrBal: number;
  CrBal: number;
}

export interface TrailBalance {
  Type: string;
  Level: number;
  ID?: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
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

export interface Entity {
  Entity: TrailBalance[];
  Company: Company;
}

export interface TrailBalanceModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface GroupBalanceList {
  Type: string;
  Level: number;
  ID?: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface GroupBalance {
  Entity: GroupBalanceList[];
  ClosingBalance: string;
  Company: Company;
}

export interface GroupBalanceModel {
  StatusCode: number;
  Message: string;
  Entity: GroupBalance;
}

export interface LedgerList {
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

export interface LedgerDetails {
  Entity: LedgerList[];
  Company: Company;
}

export interface LedgerDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerDetails;
}
