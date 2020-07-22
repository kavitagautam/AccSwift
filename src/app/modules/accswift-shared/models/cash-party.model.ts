export interface CashPartyModel {
  StatusCode: number;
  Entity: CashParty[];
}

export interface CashParty {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
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
