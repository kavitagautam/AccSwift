import { Company } from "@accSwift-modules/company/models/company.model";

export interface AccountDetails {
    InFlowAmount: number;
    OutFlowAmount: number;
    Type: string;
    Level: number;
    ID: number;
    AccountCode?: any;
    AccountName: string;
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