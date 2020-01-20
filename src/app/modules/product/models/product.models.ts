export interface ProductGroup {
  ID: number;
  ParentID: number;
  ParentGroupName: string;
  Level: number;
  EngName: string;
  NepName: string;
  IsBuiltIn: boolean;
  BackColor: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
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
