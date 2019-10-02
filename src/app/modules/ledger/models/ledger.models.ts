export interface GroupDetails {
  ID: number;
  LedgerCode: string;
  GroupNumber: number;
  ParentGroup: number;
  Level: number;
  EngName: string;
  NepName: string;
  DebitCredit: string;
  IsBuiltIn: boolean;
  AccountType: string;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface LedgerDetails {
  ID: number;
  Code: string;
  LedgerNumber: number;
  EngName: number;
  NepName: number;
  PreviousYearBalance: number;
  PreviousYearBalanceDebitCredit: string;
  OpCCYID: number;
  Currency: string;
  OpCCR: number;
  OpCCRDate: string;
  DebitCredit: string;
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
  IsBuiltIn: boolean;
  IsActive: boolean;
  IsCalculated: boolean;
  CalculateRate: number;
  LF: number;
  IsBillReference: boolean;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: number;
  ModifiedDate: string;
}

export interface LedgerList {
  GroupID: string;
  AccGroup: string;
  ParentGroupID: number;
  ParentGroup: string;
  Ledger: string;
  Type: string;
}
