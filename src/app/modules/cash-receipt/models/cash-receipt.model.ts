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

export interface SeriesListModel {
  Status: number;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
}

export interface CashPartyListModel {
  Status: number;
  Entity: CashPartyList[];
}

export interface CashPartyList {
  LedgerID: number;
  LedgerCode: string;
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

export interface CashReceiptMaster {
  ID: number;
  Date: Date;
  IsPayByInvoice: boolean;
  TotalAmount: number;
  CashReceiptDetails?: any;
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
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface CashReceiptMasterModel {
  StatusCode: number;
  Message: string;
  Entity: CashReceiptMaster[];
}

export interface CashReceiptDetail {
  VoucherType: string;
  VoucherNumber: string;
  DiscountAmount: number;
  InvoiceType: string;
  InvoiceID: number;
  ID: number;
  MasterID: number;
  LedgerID: number;
  LedgerName: string;
  LedgerCode: string;
  LedgerBalance: string;
  Amount: number;
  Remarks: string;
}

export interface CashReceiptDetail {
  ID: number;
  Date: Date;
  IsPayByInvoice: boolean;
  TotalAmount: number;
  CashReceiptDetails: CashReceiptDetail[];
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
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface CashReceiptDetailModel {
  StatusCode: number;
  Message: string;
  Entity: CashReceiptDetail;
}
export interface CashAccountsModel {
  Entity: CashAccountList[];
}

export interface CashAccountList {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
