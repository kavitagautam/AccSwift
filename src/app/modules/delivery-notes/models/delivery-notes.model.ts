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

export interface DeliveryNoteList {
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
    TotalQty: number;
    DeliveryProductsList: DeliveryProductsList[];
    Remarks?: any;
    CompanyID: number;
    CreatedBy: string;
    CreatedDate: Date;
    ModifiedBy: string;
    ModifiedDate: Date;
}

export interface DeliveryNotesNavigate {
    Entity: DeliveryNoteList[];
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
    TotalQty: number;
    DeliveryProductsList: DeliveryProductsList[];
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
    Entity: DeliveryNotes;
}