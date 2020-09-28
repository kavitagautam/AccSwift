export interface JournalEditModel {
  StatusCode: number;
  Message: string;
  Entity: Journal;
}

export interface Journaldetail {
  DrAmount?: number;
  CrAmount?: number;
  ID: number;
  MasterID: number;
  LedgerID: number;
  CodeName: string;
  LedgerName: string;
  LedgerCode: string;
  LedgerBalance: string;
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
  Journaldetails: Journaldetail[];
  Fields: Fields;
  SeriesID: number;
  SeriesName: string;
  IsVoucherNoEnabled: boolean;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  AccClassIDs: number[];
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
