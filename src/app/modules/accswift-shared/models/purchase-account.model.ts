export interface PurchaseAccounts {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  LedgerBalance: string;
  CodeName: string;
  GroupID: number;
}

export interface PurchaseAccountRootModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseAccounts[];
}
