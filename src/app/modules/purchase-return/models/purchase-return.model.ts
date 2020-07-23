export interface PurchaseReturnRootModel {
  StatusCode: number;
  Message: string;
  Entity: PurchaseReturnModel;
}

export interface PurchaseReturnModel {
  Entity: [];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: Number;
  CurrentPage: Number;
  TotalPages: number;
}
