export interface PurchInvoiceDetail {
  PurchaseInvoiceID: number;
  ID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  PurchaseRate: number;
  Amount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  TaxAmount: number;
  VAT: number;
  CustomDuty: number;
  CustomDutyPercent: number;
  Freight: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
}

export interface PurchaseInvoice {
  ID: number;
  Date: Date;
  TotalQty: number;
  PartyBillNumber?: any;
  PurchInvoiceDetails: PurchInvoiceDetail[];
  PurchaseLedgerID: number;
  PurchaseName: string;
  CustomDuty: number;
  Freight: number;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: string;
  GrossAmount: number;
  SpecialDiscount: number;
  NetAmount: number;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  VAT: number;
  TotalAmount: number;
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

export interface PurchaseInvoiceNavigate {
  Entity: PurchaseInvoice[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface PurchaseInvoiceNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseInvoiceNavigate;
}

export interface PurchaseInvoiceDetailModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseInvoice;
}
