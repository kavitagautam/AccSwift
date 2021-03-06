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

export interface ProductGroupModel {
  StatusCode: number;
  Message: string;
  Entity: ProductGroup;
}
