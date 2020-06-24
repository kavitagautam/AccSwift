export interface Ledger {
  TransactionDate: Date;
  LedgerID: number;
  VoucherNo: string;
  AccountName: string;
  RowID: number;
  VoucherType: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface DayBook {
  Entity: Ledger[];
  DebitTotal: number;
  CreditTotal: number;
}

export interface DayBookModel {
  StatusCode: number;
  Message: string;
  Entity: DayBook;
}

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

export interface AccountClass {
  ID: number;
  Name: string;
  ParentID: number;
  Remarks?: any;
}

export interface AccountClassModel {
  StatusCode: number;
  Message: string;
  Entity: AccountClass[];
}

export interface TransactionVoucher {
  VouchType: string;
  VouchName: string;
}

export interface TransactionVoucherModel {
  StatusCode: number;
  Message: string;
  Entity: TransactionVoucher[];
}
