export interface Currency {
  ID: number;
  Name: string;
  Substring: string;
  Code: string;
  Symbol: string;
  Country: string;
  LocaleID: string;
}

export interface CurrencyRootModel {
  StatusCode: number;
  Entity: Currency[];
}
