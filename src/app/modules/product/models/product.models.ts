export interface ProductRootModel {
  StatusCode: number;
  Message: string;
  Entity: Product[];
}

export interface ProductDetailModel {
  StatusCode: number;
  Message: string;
  Entity: Product;
}

export interface OpeningQuantity {
  ID: number;
  ProductID: number;
  AccClassID: number;
  OpenPurchaseQty: number;
  OpenPurchaseRate: number;
  OpenSalesRate: number;
  OpenQuantityDate: Date;
}

export interface Product {
  ID: number;
  Name: string;
  GroupID: number;
  ProductCode: string;
  ProductColor: string;
  DepotID: number;
  UnitID: number;
  ParentProductID?: any;
  Size?: any;
  IsVatApplicable: boolean;
  IsInventoryApplicable: boolean;
  IsDecimalApplicable: boolean;
  IsActive: boolean;
  ProductImage: string;
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

export interface ProductTreeView {
  Tree: Tree[];
  Node: string[];
}

export interface ProductTreeViewModel {
  StatusCode: number;
  Message: string;
  Entity: ProductTreeView;
}
