export interface Fields {
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
}

export interface CashPayment {
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

export interface CashPaymentNavigate {
  Entity: CashPayment[];
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

export interface CashPaymentDetailModel {
  StatusCode: number;
  Message: string;
  Entity: CashPayment;
}
