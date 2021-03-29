import { Company } from "@accSwift-modules/company/models/company.model";

export interface MaterializedViewList {
    FiscalYear: string;
    InvoiceNumber: string;
    BuyerName: string;
    BuyerPan?: any;
    GrossAmount: number;
    Discount: number;
    NetAmount: number;
    TaxAmount: number;
    TotalAmount: number;
    IRDSynced: boolean;
    PrintCount: number;
    IsActive: boolean;
    PrintedTime: Date;
    EnteredBy: string;
    PrintedBy: string;
    IsRealTime: boolean;
}

export interface MaterializedViewModel {
    Entity: MaterializedViewList[];
    SumGrossAmount: number;
    SumDiscount: number;
    SumTaxAmount: number;
    SumTotalAmount: number;
    Company: Company;
}

export interface MaterializedViewRootModel {
    StatusCode: number;
    Message: string;
    Entity: MaterializedViewModel;
}
