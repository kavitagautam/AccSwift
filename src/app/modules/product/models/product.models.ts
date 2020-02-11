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
  BackColor: number;
  OpeningQuantity: OpeningQuantity;
  Remarks: string;
}

export interface ProductModel {
  StatusCode: number;
  Message: string;
  Entity: Entity[];
}

export interface Product {
  ID: number;
  EngName: string;
  NepName: string;
  GroupID: number;
  GroupName: string;
  Code: string;
  ProductColor: string;
  DepotID: number;
  UnitMaintenanceID: number;
  SalesRate: number;
  PurchaseRate: number;
  PurchaseDiscount: number;
  TotalValue: number;
  ProductImage: string;
  IsBuiltIn: boolean;
  IsActive: boolean;
  BackColor: number;
  IsVatApplicable: boolean;
  IsInventoryApplicable: boolean;
  DebtorsID: number;
  RentDate: string;
  Quantity: number;
  IsDecimalApplicable: boolean;
  OpeningQuantities: OpeningQuantities[];
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface OpeningQuantities {
  ID: number;
  ProductID: number;
  AccClassID: number;
  OpenPurchaseQty: number;
  OpenPurchaseRate: number;
  OpenSalesRate: number;
  OpenQuantityDate: string;
  SquareFeet: number;
  RentRate: number;
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
