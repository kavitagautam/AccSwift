export interface CompoundUnit {
  ID: number;
  FirstUnitID: number;
  FirstUnitName: string;
  SecondUnitID: number;
  SecondUnitName: string;
  RelationValue: number;
  Remarks: string;
}

export interface CompoundModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface Entity {
  Entity: CompoundUnit[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}
