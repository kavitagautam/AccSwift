export interface LedgerGroup {
  ID: number;
  LedgerCode: string;
  ParentGroupID?: number;
  Name: string;
  DrCr: string;
  IsBuiltIn: boolean;
  Remarks: string;
}

export interface LedgerGroupDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerGroup;
}

export interface LedgerGroupModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerGroup[];
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
  OpeningBalance: OpeningBalance;
  Remarks: string;
}

export interface LedgerDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerDetails;
}

export interface LedgerList {
  GroupID: number;
  AccGroup: string;
  ParentGroupID?: number;
  ParentGroup: string;
  Ledger: string;
  Type: string;
}

export interface LedgerListModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerList[];
}

export interface AccountClass {
  ID: number;
  Name: string;
  ParentID: number;
  Remarks?: any;
}

export interface AccountClassModel {
  StatusCode: number;
  Message: string;
  Entity: AccountClass[];
}
