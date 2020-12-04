
  export interface Fields
  {
      VoucherType: string;
      VoucherTypeFullName: string;
      AmountTotal: 0;
      AmountThisMonth: 0;
      AmountThisYear: 0;
      NoOfVouchers: 0
  }
  
  export interface FieldsRootModel {
      StatusCode: number;
      Message: string;
      Entity: Fields[];
    }
    