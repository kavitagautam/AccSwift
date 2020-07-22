export interface Depot {
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
  Entity: Depot[];
}

export interface Entity {
  Entity: Depot[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface DepotRootModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface DepotDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: Depot;
}
