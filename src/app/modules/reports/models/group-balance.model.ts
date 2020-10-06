import { Company } from "@accSwift-modules/company/models/company.model";

export interface GroupBalance {
  Type: string;
  DebitAmount: number;
  CreditAmount: number;
  ID: number;
  AccountCode: string;
  AccountName: string;
}

export interface GroupBalanceModel {
  Entity: GroupBalance[];
  ClosingBalance: string;
  Company: Company;
}

export interface GroupBalanceRootModel {
  StatusCode: number;
  Message: string;
  Entity: GroupBalanceModel;
}
