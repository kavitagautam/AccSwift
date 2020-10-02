export interface ProductOrGroup {
    PurchaseRate: number;
    SalesRate: number;
    ClosingQty?: any;
    QtyUnitID: number;
    IsInventory: boolean;
    IsVAT: boolean;
    TaxID?: number;
    CodeName: string;
    ID: number;
    TypeOf: number;
    Title: string;
}

export interface ProductOrGroupRootModel {
    StatusCode: number;
    Message: string;
    Entity: ProductOrGroup[];
}

