export interface CompoundUnit {
  ID: number;
  FirstUnitID: number;
  FirstUnitName: string;
  SecondUnitID: number;
  SecondUnitName: string;
  RelationValue: number;
  Remarks: string;
}

export interface CompoundUnitModel {
  StatusCode: number;
  Message: string;
  Entity: CompoundEntity;
}

export interface CompoundEntity {
  Entity: CompoundUnit[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}
