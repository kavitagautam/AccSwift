export interface LedgerMatch{
Status: number; 
Entity: LedgerDetails[]
}

export interface LedgerDetails{
    LedgerCode: string;
    LedgerName: string;
    LedgerID: number;
    GroupID: number;
    GroupName: string;
    Balance: string;
    ActualBalance: number;
    LedgerType: string;
}