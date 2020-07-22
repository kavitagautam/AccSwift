export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface CashReceiptList {
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

export interface CashReceiptNavigate {
  Entity: CashReceiptList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface CashReceiptNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: CashReceiptNavigate;
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

export interface CashReceipt {
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
  Entity: CashReceipt;
}
