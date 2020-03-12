export interface OpeningQuantity {
  ID: number;
  ProductID: number;
  AccClassID: number;
  OpenPurchaseQty: number;
  OpenPurchaseRate: number;
  OpenSalesRate: number;
  OpenQuantityDate: Date;
}

export interface Entity {
  ID: number;
  Name: string;
  GroupID: number;
  ProductCode: string;
  ProductColor: string;
  DepotID: number;
  UnitID: number;
  IsVatApplicable: boolean;
  IsInventoryApplicable: boolean;
  IsDecimalApplicable: boolean;
  IsActive: boolean;
  ContactPerson: string;
  Address1: string;
  Address2: string;
  City: string;
  Telephone: string;
  Email: string;
  Company: string;
  Website: string;
  BackColor: number;
  OpeningQuantity: OpeningQuantity;
  Remarks: string;
}

export interface ProductDetailModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface ProductModel {
  StatusCode: number;
  Message: string;
  Entity: Entity[];
}

export interface Product {
  ID: number;
  Name: string;
  GroupID: number;
  ProductCode: string;
  ProductColor: string;
  DepotID: number;
  UnitID: number;
  IsVatApplicable: boolean;
  IsInventoryApplicable: boolean;
  IsDecimalApplicable: boolean;
  IsActive: boolean;
  ContactPerson?: any;
  Address1?: any;
  Address2?: any;
  City?: any;
  Telephone?: any;
  Email?: any;
  Company?: any;
  Website?: any;
  BackColor: number;
  OpeningQuantity: OpeningQuantity;
  Remarks: string;
}

export interface OpeningQuantities {
  ID: number;
  ProductID: number;
  AccClassID: number;
  OpenPurchaseQty: number;
  OpenPurchaseRate: number;
  OpenSalesRate: number;
  OpenQuantityDate: Date;
}

export interface Child {
  ID: number;
  TypeOf: number;
  Title: string;
  Child?: Child[];
}

export interface Tree {
  ID: number;
  TypeOf: number;
  Title: string;
  Child: Child[];
}

export interface Entity {
  Tree: Tree[];
  Node: string[];
}

export interface ProductGroupTree {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface ProductGroup {
  ID: number;
  ParentGroupID: number;
  ParentGroupName: string;
  Name: string;
  BackColor: string;
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
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

export interface DepotModel {
  StatusCode: number;
  Message: string;
  Entity: DepotList[];
}

export interface AccountClass {
  ID: number;
  Name: string;
  ParentID: number;
  Remarks?: any;
}

export interface AccountClassModel {
  StatusCode: number;
  Message: string;
  Entity: AccountClass[];
}
