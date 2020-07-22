export interface Tax {
  ID: number;
  Name: string;
  Rate: number;
}

export interface TaxModel {
  StatusCode: number;
  Message: string;
  Entity: Tax[];
}
