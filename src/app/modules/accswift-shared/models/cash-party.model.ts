export interface CashPartyModel {
  StatusCode: number;
  Entity: CashParty[];
}

export interface CashParty {
  CodeName: string;
  GroupID: number;
  LedgerBalance: string;
  LedgerCode: string;
  LedgerID: number;
  LedgerName: string;
}

export interface CashPartyGrid {
  Entity: CashParty[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface CashPartyGridModel {
  StatusCode: number;
  Message: string;
  Entity: CashPartyGrid;
}
