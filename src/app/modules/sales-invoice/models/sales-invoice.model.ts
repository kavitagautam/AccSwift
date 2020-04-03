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
export interface SalesInvoiceMaster {
  ID: number;
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: string;
  Date: Date;
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
  TenderAmount: number;
  ChangeAmount: number;
  AdjustmentAmount: number;
  SalesDueDate: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: boolean;
  InvoiceDetails?: any;
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

export interface SalseInvoice {
  ID: number;
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: string;
  Date: Date;
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
  TenderAmount: number;
  ChangeAmount: number;
  AdjustmentAmount: number;
  SalesDueDate: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: boolean;
  InvoiceDetails: InvoiceDetail[];
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
  Electricity?: any;
  Garbage?: any;
  QtyUnitID: number;
  QtyUnitName: string;
  TaxID: number;
  TaxAmount: number;
  GeneralName: string;
  Description: string;
}

export interface SalseInvoiceDetails {
  ID: number;
  SalesLedgerID: number;
  SalesName: string;
  CashPartyLedgerID: number;
  CashPartName: string;
  DepotID: number;
  DepotName: string;
  OrderNo: string;
  Date: Date;
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
  TenderAmount: number;
  ChangeAmount: number;
  AdjustmentAmount: number;
  SalesDueDate: Date;
  DueDays: string;
  TableNumber: string;
  PrintCount: number;
  IRDSync: boolean;
  InvoiceDetails: InvoiceDetail[];
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

export interface SalesInvoiceDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: SalseInvoiceDetails;
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

export interface RelatedUnits {
  ID: number;
  Name: string;
}

export interface RelatedUnitModel {
  StatusCode: number;
  Message: string;
  Entity: RelatedUnits[];
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
