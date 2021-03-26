import { Company } from "@accSwift-modules/company/models/company.model";

export interface KharidKhataList {
    Seller: string;
    SellerPAN?: any;
    TotalPurchaseAmt: number;
    NonTaxableAmt: number;
    TaxablePurchaseAmt: number;
    TaxPurchaseAmt: number;
    TaxableSalesAmt: number;
    TaxSalesAmt: number;
    SalesDate: Date;
    Voucher: string;
}

export interface KharidKhataModel {
    Entity: KharidKhataList[];
    SumTotalPurchaseAmt: number;
    SumNonTaxableAmt: number;
    SumTaxablePurchaseAmt: number;
    SumTaxPurchaseAmt: number;
    SumTaxableSalesAmt: number;
    SumTaxSalesAmt: number;
    Company: Company;
}

export interface KharidKhataRootModel {
    StatusCode: number;
    Message: string;
    Entity: KharidKhataModel;
}
