export interface AccountDetails {
    InFlowAmount: number;
    OutFlowAmount: number;
    Type: string;
    Level: number;
    ID: number;
    AccountCode?: any;
    AccountName: string;
}

export interface Company {
    ID: number;
    Name: string;
    Code: string;
    Address1: string;
    Address2: string;
    City: string;
    District?: any;
    Zone: string;
    Telephone: string;
    Email: string;
    Website: string;
    POBox?: any;
    PAN: string;
    Logo?: any;
    FYFrom: Date;
    BookBeginFrom: Date;
    FiscalYear: string;
    UserName?: any;
    Password?: any;
    IsBuiltIn: boolean;
    CountryID?: any;
    CountryName?: any;
    StateOrProvinceID?: any;
    StateOrProvinceName?: any;
    APIKey: string;
    Remarks: string;
    CompanyID: number;
    CreatedBy?: any;
    CreatedDate?: any;
    ModifiedBy: string;
    ModifiedDate: Date;
}

export interface CashFlowModel {
    Entity: AccountDetails[];
    TotalInFlowAmount: number;
    TotalOutFlowAmount: number;
    Company: Company;
}

export interface CashFlowRootModel {
    StatusCode: number;
    Message: string;
    Entity: CashFlowModel;
}