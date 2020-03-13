export interface LedgerGroup {
  ID: number;
  LedgerCode: string;
  ParentGroupID?: number;
  Name: string;
  DrCr: string;
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
