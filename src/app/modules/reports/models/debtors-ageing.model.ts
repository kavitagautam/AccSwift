import { Company } from "@accSwift-modules/company/models/company.model";

export interface DebtorsAgeingList {
    Debtors: string;
    ID: number;
    TotalAmount: number;
    Current: number;
    FirstPeriod: number;
    SecondPeriod: number;
    ThirdPeriod: number;
    FourthPeriod: number;
    FifthPeriod: number;
}

export interface DebtorsCompany {
    Entity: DebtorsAgeingList[];
    Company: Company;
}

export interface DebtorsAgeingRootModel {
    StatusCode: number;
    Message: string;
    Entity: DebtorsCompany;
}
