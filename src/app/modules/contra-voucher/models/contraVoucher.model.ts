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
  StatusCode: number;
  Message: string;
  Entity: SeriesEntity[];
}

export interface SeriesEntity {
  ID: number;
  Name: string;
  VoucherType: string;
}

export interface ContraVoucherMaster {
  IsPayByInvoice: boolean;
  TotalAmount: number;
  ContraVoucherDetails: ContraVoucherDetails[];
  LedgerID: number;
  LedgerName: string;
  ID: number;
  SeriesID: number;
  SeriesName: string;
  VoucherNo: string;
  Date: string;
  ProjectID: number;
  ProjectName: string;
  Fields: {
    Field1: string;
    Field2: string;
    Field3: string;
    Field4: string;
    Field5: string;
  };
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface ContraVoucherDetails {
  VoucherType: string;
  VoucherNumber: string;
  DiscountAmount: number;
  InvoiceType: string;
  InvoiceID: number;
  ID: number;
  MasterID: number;
  LedgerID: number;
  Ledger: {
    ID: number;
    Code: string;
    LedgerNumber: number;
    EngName: string;
    NepName: string;
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
    ModifiedBy: string;
    ModifiedDate: string;
  };
  Amount: number;
  Remarks: string;
}

export interface CashParty {
  Status: number;
  Entity: CashPartyEntity[];
}

export interface CashPartyEntity {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface CashAccounts {
  Status: number;
  Entity: Entity[];
}

export interface Entity {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
