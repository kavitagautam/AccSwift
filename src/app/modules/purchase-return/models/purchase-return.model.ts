export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface SeriesList {
  ID: number;
  EngName: string;
  NepName: string;
  VoucherType: string;
  AutoNumber: number;
  BuiltIn: boolean;
}
