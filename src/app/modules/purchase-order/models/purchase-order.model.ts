export interface PurchaseOrder {
  ID: number;
  Date: Date;
  OrderDetails?: OrderDetail[];
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

export interface PurchaseOrderNavigate {
  Entity: PurchaseOrder[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface PurchaseOrderNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseOrderNavigate;
}

export interface OrderDetail {
  ID: number;
  PurchaseOrderID: number;
  PurchaseRate: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
  UpdatedQuantity: number;
  PenndingQuantity: number;
}

export interface PurchaseOrderDetailModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseOrder;
}
