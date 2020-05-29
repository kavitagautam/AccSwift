export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID?: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface ProjectListModel {
  StatusCode: number;
  Message: string;
  Entity: ProjectList[];
}

export interface SeriesListModel {
  Status: number;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
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

export interface SalesAccounts {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export interface SalesAccountModel {
  StatusCode: number;
  Message: string;
  Entity: SalesAccounts[];
}

export interface DepotList {
  ID: number;
  DepotName: string;
  City: string;
  Telephone: string;
  ContactPerson: string;
  LicenceNo: string;
  DepotAddress: string;
  PostalCode: string;
  Mobile: string;
  RegNo: string;
  Remarks: string;
}

export interface DepotListModel {
  StatusCode: number;
  Message: string;
  Entity: DepotList[];
}

export interface TaxList {
  ID: number;
  Name: string;
  Rate: number;
}

export interface TaxListModel {
  StatusCode: number;
  Message: string;
  Entity: TaxList[];
}

export interface RelatedUnits {
  ID: number;
  Name: string;
}

export interface RelatedUnitModel {
  StatusCode: number;
  Message: string;
  Entity: RelatedUnits[];
}

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
