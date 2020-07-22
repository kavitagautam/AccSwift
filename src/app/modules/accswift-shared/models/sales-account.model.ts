export interface SalesAccounts {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface SalesAccountModel {
  StatusCode: number;
  Message: string;
  Entity: SalesAccounts[];
}
