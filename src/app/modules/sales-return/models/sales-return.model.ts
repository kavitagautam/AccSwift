export interface SalesReturnList {
  ID: number;
  OrderNo: string;
  Date: Date;
  TotalAmount: number;
  TotalQty: number;
  ReturnDetails: ReturnDetail[];
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  GrossAmount: number;
  SpecialDiscount: number;
  NetAmount: number;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  VAT: number;
  TotalTCAmount: number;
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
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface SalesReturnNavigate {
  Entity: SalesReturnList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface SalesReturnNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: SalesReturnNavigate;
}

export interface ReturnDetail {
  SalesReturnID: number;
  ID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  SalesRate: number;
  Amount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
  TaxAmount: number;
}

export interface SalesReturnDetail {
  ID: number;
  OrderNo: string;
  Date: Date;
  TotalAmount: number;
  TotalQty: number;
  ReturnDetails: ReturnDetail[];
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  GrossAmount: number;
  SpecialDiscount: number;
  NetAmount: number;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  VAT: number;
  TotalTCAmount: number;
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
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface SalesReturnDetailModel {
  StatusCode: number;
  Message: string;
  Entity: SalesReturnDetail;
}
