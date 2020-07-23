export interface SalesReportList {
  SalesQty: number;
  NetSalesQty: number;
  Code?: any;
  Unit: string;
  Rate: number;
  ID: number;
  Name: string;
  ReturnQty: number;
  Amount: number;
  DiscountAmount: number;
  VATAmount: number;
  NetAmount: number;
}

export interface SasleReports {
  Entity: SalesReportList[];
  TotalReturnQty: number;
  TotalSalesQty: number;
  TotalNetSalesQty: number;
  TotalAmount: number;
  TotalVATAmount: number;
  TotalNetAmount: number;
  TotalDiscountAmount: number;
}

export interface SalesReportModel {
  StatusCode: number;
  Message: string;
  Entity: SasleReports;
}

export interface CashPartyGroup {
  ID: number;
  LedgerCode: string;
  ParentGroupID: number;
  Name: string;
  DrCr: string;
  IsBuiltIn: boolean;
  Remarks: string;
}

export interface CashPartyGroupModel {
  StatusCode: number;
  Message: string;
  Entity: CashPartyGroup[];
}

export interface PurchaseList {
  NetPurchaseQty: number;
  PurchaseQty: number;
  Code: string;
  Unit: string;
  Rate: number;
  ID: number;
  Name: string;
  ReturnQty: number;
  Amount: number;
  DiscountAmount: number;
  VATAmount: number;
  NetAmount: number;
}

export interface PurchaseReport {
  Entity: PurchaseList[];
  TotalReturnQty: number;
  TotalPurchaseQty: number;
  TotalNetPurchaseQty: number;
  TotalAmount: number;
  TotalVATAmount: number;
  TotalNetAmount: number;
  TotalDiscountAmount: number;
}

export interface PurchaseReportModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseReport;
}
