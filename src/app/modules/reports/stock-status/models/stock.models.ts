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
