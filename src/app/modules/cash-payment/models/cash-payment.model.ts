export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface SeriesList {
  ID: number;
  EngName: string;
  NepName: string;
  VoucherType: string;
  AutoNumber: number;
  BuiltIn: boolean;
}

export interface CashPaymentMaster {
  CashPaymentDetailsList: CashPaymentDetails[];
  LedgerID: number;
  LedgerName: string;
  ID: number;
  SeriesID: number;
  SeriesName: string;
  VoucherNo: string;
  Date: Date;
  ProjectID: number;
  ProjectName: string;
  Fields: {
    Field1: string;
    Field2: string;
    Field3: string;
    Field4: string;
    Field5: string;
  }
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface CashPaymentDetails {
  ID: number,
  MasterID: number,
  LedgerID: number,
  Ledger: {
    ID: number,
    Code: string,
    LedgerNumber: number,
    EngName: string,
    NepName: string,
    PreviousYearBalance: number,
    PreviousYearBalanceDebitCredit: string,
    OpCCYID: number,
    Currency: string,
    OpCCR: number,
    OpCCRDate: Date,
    DebitCredit: string,
    GroupID: number,
    GroupName: string,
    PersonName: string,
    Address1: string,
    Address2: string,
    City: string,
    Phone: string,
    Email: string,
    Company: string,
    Website: string,
    VatPanNo: string,
    CreditLimit: number,
    IsBuiltIn: boolean,
    IsActive: boolean,
    IsCalculated: boolean,
    CalculateRate: number,
    LF: number,
    IsBillReference: boolean,
    Remarks: string,
    CreatedBy: string,
    CreatedDate: Date,
    ModifiedBy: string,
    ModifiedDate: Date
  },
  Amount: number,
  Remarks: string
}

export interface LedgerList {
  LedgerCode: string;
  LedgerName: string;
  LedgerID: number;
  GroupID: number;
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
}
