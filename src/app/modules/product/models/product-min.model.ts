export interface ProductMin {
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  CodeName: string;
  PurchaseRate: number;
  SalesRate: number;
  ClosingQty: number;
  QtyUnitID: number;
  QtyUnitName: string;
  IsInventory: boolean;
  IsVAT: boolean;
  GroupID: number;
  GroupName: string;
}

export interface ProductMinRootModel {
  StatusCode: number;
  Message: string;
  Entity: ProductMin[];
}
