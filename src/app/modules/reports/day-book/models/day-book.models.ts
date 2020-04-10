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
