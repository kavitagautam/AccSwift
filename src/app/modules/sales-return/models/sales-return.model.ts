export interface ReturnDetail {
  SalesReturnID: number;
  SalesRate: number;
  VATAmount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID?: number;
  TaxAmount: number;
  ID: number;
  ProductID: number;
  ProductName: string;
  CodeName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
  Remarks: string;
}

export interface SalesReturnNavigate {
  Entity: SalesReturn[];
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

export interface SalesReturn {
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
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
  SeriesID: number;
  SeriesName: string;
  IsVoucherNoEnabled: boolean;
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  AccClassIDs: number[];
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface SalesReturnDetailModel {
  StatusCode: number;
  Message: string;
  Entity: SalesReturn;
}
