export interface SalesInvoiceMaster {
  ID: number;
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: string;
  SalesInvoiceDate: Date;
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
  SalesDueDate: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: true;
  InvoiceDetails: [
    {
      ID: number;
      SalesInvoiceID: number;
      ProductID: number;
      ProductName: string;
      ProductCode: string;
      Quantity: number;
      SalesRate: number;
      Amount: number;
      DiscPercentage: number;
      DiscountAmount: number;
      NetAmount: number;
      Electricity: number;
      Garbage: number;
      TaxAmount: number;
      QtyUnitID: number;
      QtyUnitName: string;
      TaxID: number;
      GeneralName: string;
      Description: string
    }
  ],
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

export interface SalesInvoiceDetail {
  ID: number;
  SalesInvoiceID: number;
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  Quantity: number;
  SalesRate: number;
  Amount: number;
  DiscPercentage: number;
  DiscountAmount: number;
  NetAmount: number;
  Electricity: number;
  Garbage: number;
  TaxAmount: number;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
  GeneralName: string;
  Description: string;
}
