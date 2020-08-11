export interface VoucherType {
  VouchType: string;
  VouchName: string;
}

export interface VoucherTypeModel {
  StatusCode: number;
  Message: string;
  Entity: VoucherType[];
}
