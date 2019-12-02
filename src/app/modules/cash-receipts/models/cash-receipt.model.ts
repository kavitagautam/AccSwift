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

export interface SeriesList {
  ID: number;
  EngName: string;
  NepName: string;
  VoucherType: string;
  AutoNumber: number;
  BuiltIn: boolean;
}

export interface CashReceiptMaster {
  ID: number;
  SeriesID: number;
  SeriesName: string;
  LedgerID: number;
  LedgerName: string;
  VoucherNo: string;
  CashReceiptDate: Date;
  ProjectID: number;
  ProjectName: string;
  Fields: {
    Field1: string;
    Field2: string;
    Field3: string;
    Field4: string;
    Field5: string;
  };
  IsPayByInvoice: boolean;
  TotalAmount: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface CashReceiptDetails {
  ID: number;
  CashReceiptMasterID: number;
  LedgerID: number;
  LedgerName: string;
  Amount: number;
  Remarks: string;
  VoucherType: string;
  VoucherNumber: string;
  DiscountAmount: number;
  InvoiceType: string;
  InvoiceID: number;
}
