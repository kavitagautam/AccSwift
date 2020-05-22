export interface VoucherFormat {
  ID: number;
  FormatType: string;
  Parameter: string;
  SeriesID: number;
}

export interface VouchNumberConfiguration {
  ID: number;
  NumberingType: string;
  DuplicateVoucherNumber: string;
  BlankVoucherNumber: string;
  StartingNo: number;
  IsSpecifyEndNo: boolean;
  EndNo: number;
  WarningVouLeft: number;
  WarningMessage: string;
  RenumberingFrequency: string;
  IsNumericPart: boolean;
  TotalLengthNumPart: number;
  PaddingChar: string;
  SerieID: number;
  IsHideVoucherNumber: boolean;
}

export interface OptionalFields {
  ID: number;
  NumberOfField: number;
  Field: number;
  Field1: string;
  Field2: string;
  Field3: string;
  Field4: string;
  Field5: string;
  SeriesID: number;
  VoucherType: string;
  IsField1Required: boolean;
  IsField2Required: boolean;
  IsField3Required: boolean;
  IsField4Required: boolean;
  IsField5Required: boolean;
}

export interface VoucherConfiguration {
  ID: number;
  Name: string;
  VoucherType: string;
  AutoNumber: number;
  VoucherFormat: VoucherFormat[];
  VouchNumberConfiguration: VouchNumberConfiguration;
  OptionalFields: OptionalFields;
  CompanyID: number;
  Remarks: string;
}

export interface VoucherConfigurationModel {
  StatusCode: number;
  Message: string;
  Entity: VoucherConfiguration;
}

export interface Child {
  ID: number;
  TypeOf: number;
  Title: string;
  Child?: any;
}

export interface Tree {
  ID: string;
  TypeOf: number;
  Title: string;
  Child: Child[];
}

export interface SeriesTreeViewModel {
  Tree: Tree[];
  Node: string[];
}

export interface SeriesListModel {
  Status: number;
  Entity: SeriesList[];
}

export interface SeriesList {
  ID: number;
  Name: string;
}
