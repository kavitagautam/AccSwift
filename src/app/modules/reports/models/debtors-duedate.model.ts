import { Company } from '@accSwift-modules/company/models/company.model';

export interface DebtorsDuedateList {
    RowID: number;
    TransactDate: Date;
    VoucherType: string;
    DueDate: Date;
    OverDueDays: number;
    Balance: number;
}

export interface DebtorsDuedateModel {
    DebtorName: string;
    Entity: DebtorsDuedateList[];
    TotalAmount: number;
    Company: Company;
}

export interface DebtorsDuedateRootModel {
    StatusCode: number;
    Message: string;
    Entity: DebtorsDuedateModel;
}
