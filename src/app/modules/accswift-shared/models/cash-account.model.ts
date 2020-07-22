export interface CashAccountsModel {
  Status: number;
  Entity: CashAccounts[];
}

export interface CashAccounts {
  LedgerID: number;
  LedgerCode: number;
  LedgerName: string;
  GroupID: number;
}
