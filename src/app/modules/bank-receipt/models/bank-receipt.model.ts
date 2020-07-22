export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
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

export interface BankReceipt {
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

export interface BankReceiptNavigate {
  Entity: BankReceipt[];
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

export interface BankReceiptEditModel {
  StatusCode: number;
  Message: string;
  Entity: BankReceipt;
}
