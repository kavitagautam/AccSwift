export interface Country {
  ID: number;
  Name: string;
}

export interface CountryRootModel {
  StatusCode: number;
  Message: string;
  Entity: Country[];
}

export interface StateProvince {
  ID: number;
  CountryID: number;
  CountryName: string;
  Name: string;
  DisplayLabel: string;
}

export interface StateProvinceRootModel {
  StatusCode: number;
  Message: string;
  Entity: StateProvince[];
}
