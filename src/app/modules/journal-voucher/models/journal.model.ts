export interface JournalLists {
  Entity: JournalMaster[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPage: number;
}

export interface JournalMaster {
  ID: number;
  VoucherNo: number;
  Date: string;
  SeriesID: number;
  SeriesName: string;
  ProjectID: number;
  ProjectName: string;
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
  Journaldetails: JournalDetails[];
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
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
  ID: number;
  EngName: string;
  NepName: string;
  VoucherType: string;
  AutoNumber: number;
  BuiltIn: boolean;
}
