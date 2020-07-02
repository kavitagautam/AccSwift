export interface ProfitLossLists {
  Level: number;
  RowID?: any;
  AccountName: string;
  Amount?: number;
  ID?: number;
  Type: string;
  Category: number;
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
