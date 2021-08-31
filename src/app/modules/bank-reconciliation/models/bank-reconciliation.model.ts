export interface BankReconciliationDetailsList {
  DrCr: string;
  ID: number;
  MasterID: number;
  LedgerID: number;
  CodeName: string;
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

export interface AccClassID {}

export interface BankReconciliation {
  ID: number;
  Date: Date;
  BankReconciliationDetailsList: BankReconciliationDetailsList[];
  IsReceipt: boolean;
  LedgerID: number;
  LedgerName: string;
  Fields: Fields;
  SeriesID: number;
  SeriesName: string;
  IsVoucherNoEnabled: boolean;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  AccClassIDs: AccClassID[];
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export class BankReconciliationRootModel {
  StatusCode: number;
  Message: string;
  Entity: BankReconciliationModel;
}

export class BankReconciliationModel {
  Entity: BankReconciliation[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}
