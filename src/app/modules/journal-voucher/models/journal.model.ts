export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface JournalMasterList {
  ID: number;
  Date: Date;
  Journaldetails?: any;
  SeriesID: number;
  SeriesName: string;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  Fields: Fields;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface JournalNavigate {
  Entity: JournalMasterList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface JournalNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: JournalNavigate;
}

export interface JournalDetails {
  DebitCredit: string;
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
  ID: number;
  MasterID: number;
  LedgerID: number;
  LedgerName: string;
  Amount: number;
  Remarks: string;
}

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
  Status: number;
  Entity: SeriesEntity[];
}

export interface SeriesEntity {
  ID: number;
  Name: string;
}

export interface Journaldetail {
  DebitCredit: string;
  ID: number;
  MasterID: number;
  LedgerID: number;
  LedgerName: string;
  LedgerCode: string;
  LedgerBalance: string;
  Amount: number;
  Remarks: string;
}

export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface JournalDetails {
  ID: number;
  Date: Date;
  Journaldetails: Journaldetail[];
  SeriesID: number;
  SeriesName: string;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  Fields: Fields;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface JournalDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: JournalDetails;
}
