import { Ledger } from "@app/modules/ledger/models/ledger.models";

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

export interface TransactionVoucher {
  VouchType: string;
  VouchName: string;
}

export interface TransactionVoucherModel {
  StatusCode: number;
  Message: string;
  Entity: TransactionVoucher[];
}
