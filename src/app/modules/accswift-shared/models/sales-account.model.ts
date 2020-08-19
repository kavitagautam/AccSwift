export interface SalesAccounts {
  CodeName: string;
  GroupID: number;
  LedgerBalance: string;
  LedgerCode: string;
  LedgerID: number;
  LedgerName: string;
}

export interface SalesAccountModel {
  StatusCode: number;
  Message: string;
  Entity: SalesAccounts[];
}
