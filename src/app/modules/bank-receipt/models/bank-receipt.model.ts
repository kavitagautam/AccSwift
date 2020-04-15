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
  Status: number;
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

export interface BankReceiptList {
  ID: number;
  Date: Date;
  IsPayByInvoice: boolean;
  TotalAmount: number;
  BankReceiptDetailsList?: any;
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

export interface BankReceiptNavigate {
  Entity: BankReceiptList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface BankReceiptNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: BankReceiptNavigate;
} 

export interface BankReceiptDetailsList {
  ChequeNumber: string;
  ChequeBank: string;
  ChequeDate?: any;
  VoucherNumber: string;
  VoucherType: string;
  InvoiceID: number;
  InvoiceType: string;
  DiscountAmount: number;
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

export interface BankReceiptDetail {
  ID: number;
  Date: Date;
  IsPayByInvoice: boolean;
  TotalAmount: number;
  BankReceiptDetailsList: BankReceiptDetailsList[];
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

export interface BankReceiptDetailModel {
  StatusCode: number;
  Message: string;
  Entity: BankReceiptDetail;
}
export interface BankAccounts {
  Status: number;
  Entity: Entity[];
}

export interface Entity {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
