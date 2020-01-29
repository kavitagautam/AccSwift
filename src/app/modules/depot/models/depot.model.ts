export interface DepotList {
  ID: number;
  DepotName: string;
  City: string;
  Telephone: number;
  ContactPerson: string;
  LicenceNo: number;
  DepotAddress: string;
  PostalCode: number;
  Mobile: number;
  RegNo: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface Entity {
  Entity: DepotList[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface DepotModel {
  StatusCode: number;
  Message: string;
  Entity: Entity;
}

export interface DepotDetailsModel {
  StatusCode: number;
  Message: string;
  Entity: DepotList;
}
