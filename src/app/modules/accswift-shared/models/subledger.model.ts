export interface SubLedgerMin {
  SubLedegerID: number;
  Name: string;
  Code: string;
}

export interface SubLedgerMinModel {
  StatusCode: number;
  Message: string;
  Entity: SubLedgerMin[];
}

export interface SubLedgerEntry {
  totalAmount: number;
  amountType: string;
  rowIndex: number;
}
