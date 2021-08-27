import { Company } from "@accSwift-modules/company/models/company.model";

export interface Ledger {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  DrBal: number;
  CrBal: number;
}

export interface TrailBalance {
  Type: string;
  Level: number;
  ID?: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface Entity {
  Entity: TrailBalance[];
  Company: Company;
  ReportType: string;
}

export interface TrailBalanceModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface GroupBalanceList {
  Type: string;
  Level: number;
  ID?: number;
  AccountCode: string;
  AccountName: string;
  DebitAmount: number;
  CreditAmount: number;
}

export interface GroupBalance {
  Entity: GroupBalanceList[];
  ClosingBalance: string;
  Company: Company;
}

export interface GroupBalanceModel {
  StatusCode: number;
  Message: string;
  Entity: GroupBalance;
}
