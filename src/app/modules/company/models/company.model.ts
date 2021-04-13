export interface Company {
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
  FYFrom?: Date;
  BookBeginFrom?: Date;
  FiscalYear: string;
  UserName?: any;
  Password?: any;
  IsBuiltIn: boolean;
  CountryID?: any;
  CountryName?: any;
  StateOrProvinceID?: any;
  StateOrProvinceName?: any;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate?: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
}

export interface CompanyModel {
  Entity: Company[];
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
  Entity: Company;
}

export interface Suggestion {
  SuggestedCompanyCode: string;
  SuggestedUserName: string;
}

export interface SuggestionRootModel {
  StatusCode: number;
  Message: string;
  Entity: Suggestion;
}
