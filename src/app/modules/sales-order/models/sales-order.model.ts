export interface SalesOrderNavigate {
  Entity: SalesOrder[];
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
  UpdatedQuantity: number;
  PenndingQuantity: number;
  ProductID: number;
  ProductName: string;
  CodeName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
}

export interface SalesOrder {
  ID: number;
  Date: Date;
  TotalAmount: number;
  TotalQty: number;
  OrderDetails: OrderDetail[];
  OrderNo: string;
  SeriesID: number;
  SeriesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  ProjectID: number;
  ProjectName: string;
  AccClassIDs?: any;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface SalesOrderDetailModel {
  StatusCode: number;
  Message: string;
  Entity: SalesOrder;
}
