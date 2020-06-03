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

export interface CashParty {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface CashPartyModel {
  StatusCode: number;
  Message: string;
  Entity: CashParty[];
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

export interface DepotList {
  ID: number;
  Name: string;
}

export interface DepotModel {
  StatusCode: number;
  Message: string;
  Entity: DepotList[];
}

export interface SalesAccount {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface SalesAccountModel {
  StatusCode: number;
  Message: string;
  Entity: SalesAccount[];
}
