export interface LedgerListView {
  GroupID: number;
  AccGroup: string;
  ParentGroupID?: number;
  ParentGroup: string;
  Ledger: string;
  Type: string;
}

export interface LedgerListViewModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerListView[];
}

export interface OpeningBalance {
  ID: number;
  LedgerID: number;
  AccClassID: number;
  OpenBal: number;
  OpenBalDate: Date;
  OpenBalDrCr: string;
  OpenBalCCYID: number;
}

export interface LedgerDetailsQQ {
  ID: number;
  LedgerCode: string;
  Name: string;
  PreviousYearBalance: number;
  PreviousYearBalanceDebitCredit: string;
  OpCCYID: number;
  Currency: string;
  OpCCR: number;
  OpCCRDate?: any;
  DrCr: string;
  GroupID: number;
  GroupName: string;
  PersonName: string;
  Address1: string;
  Address2: string;
  City: string;
  Phone: string;
  Email: string;
  Company: string;
  Website: string;
  VatPanNo: string;
  CreditLimit: number;
  IsActive: boolean;
  OpeningBalance?: OpeningBalance;
  Remarks: string;
}

export interface OpeningBalance {
  ID: number;
  LedgerID: number;
  AccClassID: number;
  OpenBal: number;
  OpenBalDate: Date;
  OpenBalDrCr: string;
  OpenBalCCYID: number;
}

export interface OpenBalanceSubLedger {
  SubLedgerID: number;
  ID: number;
  AccClassID: number;
  OpenBal: number;
  OpenBalDate: Date;
  OpenBalDrCr: string;
  OpenBalCCYID: number;
}

export interface SubLedgerList {
  ID: number;
  Name: string;
  Code?: any;
  LedgerID: number;
  LedgerName: string;
  IsActive: boolean;
  IsBuiltIn: boolean;
  OpenBalanceSubLedgers: OpenBalanceSubLedger[];
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
  CompanyID: number;
  Remarks: string;
}

export interface LedgerDetails {
  ID: number;
  LedgerCode: string;
  Name: string;
  PreviousYearBalance: number;
  PreviousYearBalanceDebitCredit: string;
  OpCCYID: number;
  Currency: string;
  OpCCR: number;
  OpCCRDate?: any;
  DrCr: string;
  GroupID: number;
  GroupName: string;
  PersonName?: any;
  Address1?: any;
  Address2?: any;
  City?: any;
  Phone?: any;
  Email?: any;
  Company?: any;
  Website?: any;
  VatPanNo?: any;
  CreditLimit: number;
  IsActive: boolean;
  OpeningBalance: OpeningBalance[];
  SubLedgerList: SubLedgerList[];
  Remarks?: any;
}

export interface LedgerDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerDetails;
}

export interface LedgerRootModel {
  StatusCode: number;
  Message: string;
  Entity: Ledger[];
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

export interface Ledger {
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

export interface LedgerMin {
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  LedgerBalance: string;
  CodeName: string;
  GroupID: number;
}

export interface LedgerMinModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerMin[];
}

export interface LedgerLov {
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  CodeName: string;
  GroupID: number;
}

export interface LedgerLovModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerLov[];
}
