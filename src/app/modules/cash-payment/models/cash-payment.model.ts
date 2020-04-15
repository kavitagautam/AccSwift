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

export interface CashAccounts {
  Status: number;
  Entity: Entity[];
}

export interface Entity {
  LedgerID: number;
  LedgerCode: number;
  LedgerName: string;
  GroupID: number;
}

export interface SeriesListModel {
  StatusCode: number;
  Message: string;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
  VoucherType: string;
}

export interface CashPartyListModel {
  StatusCode: number;
  Entity: CashParty[];
}

export interface CashParty {
  LedgerID: number;
  LedgerCode: number;
  LedgerName: string;
  GroupID: number;
}

export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface CashPaymentList {
  ID: number;
  Date: Date;
  CashPaymentDetailsList?: any;
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
  ModifiedDate?: any;
}

export interface CashPaymentNavigate {
  Entity: CashPaymentList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface CashPaymentNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: CashPaymentNavigate;
}

export interface CashPaymentDetailsList {
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

export interface CashPaymentDetail {
  ID: number;
  Date: Date;
  CashPaymentDetailsList: CashPaymentDetailsList[];
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
  ModifiedDate?: any;
}

export interface CashPaymentDetailModel {
  StatusCode: number;
  Message: string;
  Entity: CashPaymentDetail;
}
