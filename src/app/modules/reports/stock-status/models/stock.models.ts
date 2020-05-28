export interface Product {
  ID: number;
  Name: string;
  Code: string;
}

export interface ProductModel {
  StatusCode: number;
  Message: string;
  Entity: Product[];
}

export interface ProductGroup {
  ID: number;
  ParentGroupID: number;
  ParentGroupName: string;
  Name: string;
  BackColor: number;
  CompanyID: number;
  Remarks: string;
  CreatedBy?: any;
  CreatedDate?: any;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface ProductGroupModel {
  StatusCode: number;
  Message: string;
  Entity: ProductGroup[];
}

export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID?: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface ProjectListModel {
  StatusCode: number;
  Message: string;
  Entity: ProjectList[];
}

export interface StockStatusList {
  ProductID: number;
  Code: string;
  Name: string;
  PurchaseRate: number;
  SalesRate: number;
  OpeningQty: number;
  InBoundQty: number;
  OutBoundQty: number;
  OfficeUseQty: number;
  DamagedQty: number;
  ClosingQty: number;
  ClosingAmount: number;
}

export interface StockStatusReports {
  Entity: StockStatusList[];
  TotalOpeningQty: number;
  TotalInBoundQty: number;
  TotalOutBoundQty: number;
  TotalDamagedQty: number;
  TotalOfficeUseQty: number;
  TotalClosingQty: number;
  TotalClosingAmount: number;
}

export interface StockStatusReportsModel {
  StatusCode: number;
  Message: string;
  Entity: StockStatusReports;
}
