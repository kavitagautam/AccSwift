export interface Units {
  ID: number;
  UnitName: string;
  Symbol: string;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
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

export interface Filter {
  Attribute: string;
  Operator: string;
  Value: string;
}
