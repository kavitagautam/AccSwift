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
