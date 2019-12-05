export interface ProjectList {
  ID: number;
  ProjectNumber: number;
  ParentProjectID: number;
  EngName: string;
  NepName: string;
  Description: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface SeriesList {
  ID: number;
  EngName: string;
  NepName: string;
  VoucherType: string;
  AutoNumber: number;
  BuiltIn: boolean;
}

export interface CashPaymentMaster {
  IsPayByInvoice: boolean;
  TotalAmount: number;
  CashReceiptDetails: null;
  LedgerID: number;
  LedgerName: string;
  ID: number;
  SeriesID: number;
  SeriesName: string;
  VoucherNo: string;
  Date: string;
  ProjectID: 1;
  ProjectName: string;
  Fields: {
    Field1: string;
    Field2: string;
    Field3: string;
    Field4: string;
    Field5: string;
  };
  Remarks: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface CashReceiptDetails {
  ID: number;
  CashReceiptMasterID: number;
  LedgerID: number;
  LedgerName: string;
  Amount: number;
  Remarks: string;
  VoucherType: string;
  VoucherNumber: string;
  DiscountAmount: number;
  InvoiceType: string;
  InvoiceID: number;
}

export interface LedgerList {
  LedgerCode: string;
  LedgerName: string;
  LedgerID: number;
  GroupID: number;
  GroupName: string;
  Balance: string;
  ActualBalance: number;
  LedgerType: string;
}

export const CashReceitptDetails = {
  IsPayByInvoice: false,
  TotalAmount: 1234.0,
  CashReceiptDetails: [
    {
      VoucherType: "",
      VoucherNumber: "",
      DiscountAmount: 0.0,
      InvoiceType: "",
      InvoiceID: 0,
      ID: 16,
      MasterID: 8,
      LedgerID: 52840,
      Ledger: {
        ID: 52840,
        Code: "L-000364",
        LedgerNumber: 0,
        EngName: "Ace Consultancy",
        NepName: "Ace Consultancy",
        PreviousYearBalance: 0.0,
        PreviousYearBalanceDebitCredit: "DEBIT",
        OpCCYID: 1,
        Currency: "Nepalese Rupees",
        OpCCR: 0.0,
        OpCCRDate: null,
        DebitCredit: "DR",
        GroupID: 29,
        GroupName: "Debtor",
        PersonName: "",
        Address1: "",
        Address2: "",
        City: "",
        Phone: "",
        Email: "",
        Company: "",
        Website: "",
        VatPanNo: "",
        CreditLimit: 0.0,
        IsBuiltIn: false,
        IsActive: true,
        IsCalculated: false,
        CalculateRate: 0.0,
        LF: 0,
        IsBillReference: false,
        Remarks: "",
        CreatedBy: "2039",
        CreatedDate: "2018-05-30T17:30:49.883",
        ModifiedBy: null,
        ModifiedDate: null
      },
      Amount: 3000.0,
      Remarks: ""
    }
  ],
  LedgerID: 20712,
  LedgerName: "Pt Cash",
  ID: 8,
  SeriesID: 284,
  SeriesName: "Main",
  VoucherNo: "00024",
  Date: "2019-01-10T00:00:00",
  ProjectID: 1,
  ProjectName: "All Project",
  Fields: {
    Field1: "",
    Field2: "",
    Field3: "",
    Field4: "",
    Field5: ""
  },
  Remarks: "",
  CreatedBy: "root",
  CreatedDate: "2019-01-10T00:00:00",
  ModifiedBy: "root",
  ModifiedDate: "2019-01-10T00:00:00"
};
