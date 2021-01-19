import { Company } from "@accSwift-modules/company/models/company.model";
export interface SubLedgerDetail {
  TransactDate?: any;
  VoucherNo: string;
  VoucherType: string;
  Balance?: any;
  Type: string;
  Remarks?: any;
  RowID?: any;
  DebitAmount: number;
  CreditAmount: number;
  ID: number;
  AccountCode: string;
  AccountName: string;
}
export interface LedgerTransaction {
  SubLedgerDetails: SubLedgerDetail[];
  TransactDate?: string;
  VoucherNo: string;
  VoucherType: string;
  Balance: string;
  Type: string;
  Remarks: string;
  RowID?: number;
  DebitAmount?: number;
  CreditAmount?: number;
  ID?: number;
  AccountCode?: any;
  AccountName: string;
}

export interface LedgerTransactionModel {
  Entity: LedgerTransaction[];
  TotalDebitAmount?: any;
  TotalCreditAmount?: any;
  ClosingBalance?: any;
  Company: Company;
}

export interface LedgerTransactionRootModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerTransactionModel;
}

export interface LedgerList {
  SubLedgerDetails: SubLedgerDetail[];
  TransactDate?: string;
  VoucherNo: string;
  VoucherType: string;
  Balance: string;
  Type: string;
  Remarks: string;
  RowID?: number;
  ID?: number;
  AccountCode?: any;
  AccountName: string;
  DebitAmount?: number;
  CreditAmount?: number;
}

export interface LedgerDetails {
  Entity: LedgerList[];
  Company: Company;
}

export interface LedgerDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerDetails;
}
