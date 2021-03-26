import { Company } from "@accSwift-modules/company/models/company.model";

export interface BikriKhataList {
    BuyersName: string;
    BuyersPAN?: any;
    TotalSalesAmt: number;
    NonTaxableSalesAmt: number;
    Export: number;
    TaxableAmt: number;
    TaxAmt: number;
    SalesDate: Date;
    Voucher: string;
}

export interface BikriKhataModel {
    Entity: BikriKhataList[];
    SumTotalSalesAmt: number;
    SumNonTaxableSalesAmt: number;
    SumExport: number;
    SumTaxableAmount: number;
    SumTaxAmount: number;
    Company: Company;
}

export interface BikriKhataRootModel {
    StatusCode: number;
    Message: string;
    Entity: BikriKhataModel;
}