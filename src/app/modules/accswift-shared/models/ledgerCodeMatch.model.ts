export interface LedgerMatch {
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface LedgerMatchModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerMatch[];
}
