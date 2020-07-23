export interface SeriesRootModel {
  status: string;
  Entity: Series[];
}

export interface Series {
  ID: number;
  Name: string;
  VoucherType: string;
}
