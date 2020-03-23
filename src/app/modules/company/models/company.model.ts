export interface CompanyList {
  ID: number;
  Name: string;
  Code: string;
  Address1: string;
  Address2: string;
  City: string;
  District: string;
  Zone: string;
  Telephone: string;
  Email: string;
  Website: string;
  POBox: string;
  PAN: string;
  Logo: string;
  FYFrom: Date;
  BookBeginFrom: Date;
  FiscalYear: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface CompanyModel {
  Entity: CompanyList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface CompanyNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: CompanyModel;
}

export interface CompanyDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: CompanyList;
}
