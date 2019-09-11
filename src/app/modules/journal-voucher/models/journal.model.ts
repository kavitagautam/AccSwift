export interface JournalMaster {
  ID: number;
  VoucherNo: number;
  JournalDate: string;
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
  ID: number;
  JournalID: number;
  LedgerID: number;
  LedgerName: string;
  Amount: number;
  DebitCredit: string;
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
