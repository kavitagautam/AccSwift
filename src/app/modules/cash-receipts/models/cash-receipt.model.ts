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
  LedgerID: number;
  VoucherNo: string;
  CashReceiptDate: string;
  ProjectID: number;
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
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}
