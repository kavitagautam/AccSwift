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

export interface SeriesListModel {
  Status: number;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
}

export interface ProjectListModel {
  StatusCode: number;
  Message: string;
  Entity: ProjectList[];
}

export interface CashParty {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface CashPartyModel {
  StatusCode: number;
  Message: string;
  Entity: CashParty[];
}

export interface OrderDetail {
  ID: number;
  SalesOrderID: number;
  SalesRate: number;
  UpdatedQuantity: number;
  PenndingQuantity: number;
  ProductID: number;
  ProductName: string;
  ProductCode?: any;
  Quantity: number;
  Amount: number;
}

export interface SalesOrderList {
  ID: number;
  Date: Date;
  OrderDetails: OrderDetail[];
  OrderNo: string;
  SeriesID: number;
  SeriesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  ProjectID: number;
  ProjectName: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface SalesOrderNavigate {
  Entity: SalesOrderList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface SalesOrderNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: SalesOrderNavigate;
}

export interface SalesOrderDetail {
  ID: number;
  Date: Date;
  OrderDetails: OrderDetail[];
  OrderNo: string;
  SeriesID: number;
  SeriesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  ProjectID: number;
  ProjectName: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface SalesOrderDetailModel {
  StatusCode: number;
  Message: string;
  Entity: SalesOrderDetail;
}
