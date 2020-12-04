
export interface AccountTransact
{
    VoucherType: string;
    VoucherTypeFullName: string;
    AmountTotal: 0;
    AmountThisMonth: 0;
    AmountThisYear: 0;
    NoOfVouchers: 0
}

export interface AccountTransactRootModel {
    StatusCode: number;
    Message: string;
    Entity: AccountTransact[];
}
    

export interface Account
{
    ID: 0;
    LedgerName: string;
    GroupName: string;
    Balance: string
}

export interface AccountRootModel
{
    StatusCode: number;
    Message: string;
    Entity: Account[];
}

export interface InvTransact
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

export interface InvTransactRootModel
{
    StatusCode: number;
    Message: string;
    Entity: InvTransact[];
}