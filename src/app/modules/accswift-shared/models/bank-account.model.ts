export interface BankAccountsModel {
  Status: number;
  Entity: BankAccounts[];
}

export interface BankAccounts {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
