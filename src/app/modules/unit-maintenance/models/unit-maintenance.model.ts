export interface Units {
  ID: number;
  UnitName: string;
  Symbol: string;
  Remarks: string;
}

export interface Entity {
  Entity: Units[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface UnitsModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface UnitsDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: Units;
}
