export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID?: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface ProjectListModel {
  StatusCode: number;
  Message: string;
  Entity: ProjectList[];
}

export interface SeriesListModel {
  status: string;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
  VoucherType: string;
}

export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface BankPaymentList {
  ID: number;
  Date: Date;
  BankPaymentDetailsList?: any;
  LedgerID: number;
  LedgerName: string;
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
  ModifiedBy?: any;
  ModifiedDate: Date;
}

export interface BankPaymentNavigate {
  Entity: BankPaymentList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface BankPaymentNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: BankPaymentNavigate;
}

export interface BankPaymentDetailsList {
  ChequeNumber: string;
  ChequeDate: Date;
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

export interface BankPaymentDetail {
  ID: number;
  Date: Date;
  BankPaymentDetailsList: BankPaymentDetailsList[];
  LedgerID: number;
  LedgerName: string;
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
  ModifiedBy?: any;
  ModifiedDate: Date;
}

export interface BankPaymentDetailModel {
  StatusCode: number;
  Message: string;
  Entity: BankPaymentDetail;
}

export interface BankAccounts {
  Status: number;
  Entity: BankPaymentDetail[];
}

export interface Entity {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
