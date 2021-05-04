export interface DeliveryProductsList {
    ID: number;
    DeliveryNoteID: number;
    ProductID: number;
    ProductCode: string;
    ProductName: string;
    GeneralName: string;
    Description?: any;
    Quantity: number;
    IsService: boolean;
}

export interface DeliveryNotes {
    ID: number;
    Title: string;
    OrderDate: Date;
    DeliveryDate: Date;
    ClientLedgerID?: any;
    ClientName: string;
    ClientAddress: string;
    ClientContact: string;
    ClientPAN: string;
    ClientEmail: string;
    DeliveredBy: string;
    DeliverContact: string;
    DeliveryProductsList: DeliveryProductsList[];
    Remarks?: any;
    CompanyID: number;
    CreatedBy: string;
    CreatedDate: Date;
    ModifiedBy: string;
    ModifiedDate: Date;
}

export interface DeliveryNotesNavigate {
    Entity: DeliveryNotes[];
    ItemsPerPage: number;
    ItemsReturned: number;
    TotalItemsAvailable: number;
    CurrentPage: number;
    TotalPages: number;
}

export interface DeliveryNotesNavigateRootModel {
    StatusCode: number;
    Message: string;
    Entity: DeliveryNotesNavigate;
}

export interface DeliveryProductList {
    ID: number;
    DeliveryNoteID: number;
    ProductID: number;
    ProductCode: string;
    ProductName: string;
    GeneralName: string;
    Description?: any;
    Quantity: number;
    IsService: boolean;
}

export interface DeliveryNote {
    ID: number;
    Title: string;
    OrderDate: Date;
    DeliveryDate: Date;
    ClientLedgerID?: any;
    ClientName: string;
    ClientAddress: string;
    ClientContact: string;
    ClientPAN: string;
    ClientEmail: string;
    DeliveredBy: string;
    DeliverContact: string;
    DeliveryProductsList: DeliveryProductList[];
    Remarks?: any;
    CompanyID: number;
    CreatedBy: string;
    CreatedDate: Date;
    ModifiedBy: string;
    ModifiedDate: Date;
}

export interface DeliveryNotesRootModel {
    StatusCode: number;
    Message: string;
    Entity: DeliveryNote[];
}
