export interface LedgerGroup {
  ID: number;
  LedgerCode: string;
  ParentGroupID?: number;
  Name: string;
  DrCr: string;
  IsBuiltIn: boolean;
  Remarks: string;
}

export interface LedgerGroupDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerGroup;
}

export interface LedgerGroupModel {
  StatusCode: number;
  Message: string;
  Entity: LedgerGroup[];
}
