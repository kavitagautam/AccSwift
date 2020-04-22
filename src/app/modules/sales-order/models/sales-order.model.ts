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

export interface SalesOrderList {
  ID: number;
  Date: Date;
  OrderDetails?: any;
  CashPartyLedgerID: number;
  CashPartName: string;
  ProjectID: number;
  ProjectName: string;
  OrderNo: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
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

export interface OrderDetail {
  ID: number;
  SalesOrderID: number;
  SalesRate: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
  UpdatedQuantity: number;
  PenndingQuantity: number;
}

export interface SalesOrderDetail {
  ID: number;
  Date: Date;
  OrderDetails: OrderDetail[];
  CashPartyLedgerID: number;
  CashPartName: string;
  ProjectID: number;
  ProjectName: string;
  OrderNo: string;
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
