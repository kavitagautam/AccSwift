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

export interface SalesOrderMaster {
  ID: number;
  CashPartyLedgerID: number;
  CashPartName: string;
  OrderNo: string;
  SalesOrderDate: Date;
  OrderDetails: OrderDetailsList[];
  VoucherNo: string;
  SeriesID: number;
  SeriesName: string;
  ProjectID: number;
  ProjectName: string;
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface OrderDetailsList {
  ID: number;
  SalesOrderID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  SalesRate: number;
  Amount: number;
  UpdatedQuantity: number;
  PenndingQuantity: number;
}

export interface SalesOrderDetails {
  ID: number;
  SalesOrderID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  SalesRate: number;
  Amount: number;
  UpdatedQuantity: number;
  PenndingQuantity: number;
}
