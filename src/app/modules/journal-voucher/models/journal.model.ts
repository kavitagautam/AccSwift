export interface JournalDetails {
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

export interface Journal {
  ID: number;
  Date: Date;
  Journaldetails: JournalDetails[];
  Fields: Fields;
  SeriesID: number;
  SeriesName: string;
  IsVoucherNoEnabled: boolean;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface JournalMaster {
  Entity: Journal[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface JournalMasterRootModel {
  StatusCode: number;
  Message: string;
  Entity: JournalMaster;
}

export interface JournalEditModel {
  StatusCode: number;
  Message: string;
  Entity: Journal;
}
