export interface InvoiceDetail {
  SalesInvoiceID: number;
  Electricity?: any;
  Garbage?: any;
  GeneralName: string;
  Description: string;
  SalesRate: number;
  VATAmount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
  TaxAmount: number;
  ID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
}

export interface SalseInvoice {
  ID: number;
  OrderNo: string;
  Date: Date;
  TotalQty: number;
  TotalAmount: number;
  TenderAmount: number;
  ChangeAmount: number;
  AdjustmentAmount: number;
  SalesDueDate?: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: boolean;
  IsPay: boolean;
  InvoiceDetails: InvoiceDetail[];
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
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface SalseInvoiceNavigate {
  Entity: SalseInvoice[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface SalseInvoiceNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: SalseInvoiceNavigate;
}

export interface InvoiceDetail {
  SalesInvoiceID: number;
  Electricity?: any;
  Garbage?: any;
  GeneralName: string;
  Description: string;
  SalesRate: number;
  VATAmount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
  TaxAmount: number;
  ID: number;
  ProductID: number;
  ProductName: string;
  CodeName: string;
  ProductCode: string;
  Quantity: number;
  Amount: number;
}

export interface SalesInvoiceDetails {
  ID: number;
  OrderNo: string;
  Date: Date;
  TotalQty: number;
  TotalAmount: number;
  TenderAmount: number;
  ChangeAmount: number;
  AdjustmentAmount: number;
  SalesDueDate: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: boolean;
  IsPay: boolean;
  InvoiceDetails: InvoiceDetail[];
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
  VoucherNo: string;
  ProjectID: number;
  ProjectName: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface SalesInvoiceDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: SalesInvoiceDetails;
}

export interface PdfModel {
  StatusCode: number;
  Message: string;
  Entity: string;
}
