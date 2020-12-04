export interface Items
{
    InBoundQty:0;
    OutBoundQty:0;
    VoucherType: string;
    VoucherTypeFullName: string;
    AmountTotal: 0;
    AmountThisMonth: 0;
    AmountThisYear: 0;
    NoOfVouchers: 0
}

export interface ItemsRootModel
{
    StatusCode: number;
      Message: string;
      Entity: Items[];
}