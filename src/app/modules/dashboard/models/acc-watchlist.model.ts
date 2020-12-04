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