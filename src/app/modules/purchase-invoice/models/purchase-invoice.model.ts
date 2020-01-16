export interface PurchaseInvoiceDetails {
  ID: number;
  PurchaseInvoiceID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: number;
  Quantity: number;
  PurchaseRate: number;
  Amount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  TaxAmount: number;
  VAT: number;
  CustomDuty: number;
  CustomDutyPercecnt: number;
  Freight: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
}

export interface PurchaseInvoiceMaster {
  ID: number;
  PurchLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: number;
  PurchaseInvoicDate: Date;
  TotalQty: number;
  GrossAmount: number;
  SpecialDiscount: number;
  NetAmount: number;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  VAT: number;
  TotalAmount: number;
  TotalTCAmount: number;
  CustomDuty: number;
  PartyBillNumber: null;
  PurchInvoiceDetails: PurchaseInvoiceDetails[];
  VoucherNo: number;
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
  CreatedBy: number;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
}

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
