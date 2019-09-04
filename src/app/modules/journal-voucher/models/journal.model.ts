export interface JournalMaster {
    id?: number;
    seriresId: number;
    seriesName: string;
    voucherNo: number;
    journalDate: string;
    remarks: string;
    projectId: number;
    projectName: string;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    field1: string;
    field2: string;
    field3: string;
    field4: number;
    field5: string;
    journaldetails: Journaldetails[];
}

export interface Journaldetails {
    id: number;
    journalId: number;
    amount: number;
    debitCredit: string;
    remarks: string
  }