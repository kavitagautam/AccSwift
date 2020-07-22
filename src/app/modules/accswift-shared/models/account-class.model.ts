export interface AccountClass {
  ID: number;
  Name: string;
  ParentID: number;
  Remarks?: any;
}

export interface AccountClassModel {
  StatusCode: number;
  Message: string;
  Entity: AccountClass[];
}
