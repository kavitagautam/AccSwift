import { Company } from "@accSwift-modules/company/models/company.model";

export interface CashFlowList {
    InFlowAmount: number;
    OutFlowAmount: number;
    Type: string;
    Level: number;
    ID: number;
    AccountCode?: any;
    AccountName: string;
}

export interface CashFlowModel {
    Entity: CashFlowList[];
    TotalInFlowAmount: number;
    TotalOutFlowAmount: number;
    Company: Company;
    ReportType: string;
}

export interface CashFlowRootModel {
    StatusCode: number;
    Message: string;
    Entity: CashFlowModel;
}