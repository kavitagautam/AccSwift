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
    journaldetails: JournalDetails[];
}

export interface JournalDetails {
    id: number;
    journalId: number;
    amount: number;
    debitCredit: string;
    remarks: string
  }

  export interface ProjectList{
    id: number,
    projectNumber: number,
    parentProjectID: number,
    engName: string,
    nepName: string,
    description: string,
    createdBy: string,
    createdDate: string,
    modifiedBy: string,
    modifiedDate: string
  }