export interface RelatedUnits {
  ID: number;
  Name: string;
}

export interface RelatedUnitModel {
  StatusCode: number;
  Message: string;
  Entity: RelatedUnits[];
}
