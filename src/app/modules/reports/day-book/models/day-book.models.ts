import { Ledger } from "@accSwift-modules/ledger/models/ledger.models";

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
