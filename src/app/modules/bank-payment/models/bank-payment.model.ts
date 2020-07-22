export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
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

export interface BankPayment {
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

export interface BankPaymentNavigate {
  Entity: BankPayment[];
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

export interface BankPaymentDetailModel {
  StatusCode: number;
  Message: string;
  Entity: BankPayment;
}
