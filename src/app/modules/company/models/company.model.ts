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
  CreatedBy?: any;
  CreatedDate?: any;
  ModifiedBy: string;
  ModifiedDate: Date;
}

export interface CompanyListModel {
  StatusCode: number;
  Message: string;
  Entity: CompanyList[];
}

export interface CompanyDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: CompanyList;
}
