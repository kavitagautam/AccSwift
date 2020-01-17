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

export interface UnitsModel {
  StatusCode: number;
  Message: string;
  Entity: Units;
}
