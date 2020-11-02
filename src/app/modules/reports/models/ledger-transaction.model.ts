import { Company } from "@accSwift-modules/company/models/company.model";

export interface LedgerTransaction {
  TransactDate?: Date;
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
