export interface BudgetMinListView
{
    ID: number;
    Name: string;
    StartDate: Date;
    EndDate: Date;
}

export interface BudgetMinListViewRootModel {
    StatusCode: number;
    Message: string;
    Entity: BudgetMinListView[];
}

export interface BudgetAllocationDetail {
    ID: number;
    BudgetMasterID: number;
    AccClassID: number;
    AccClassName: string;
    Amount: number;
}

export interface BudgetAllocationMaster {
    ID: number;
    BudgetID: number;
    AccountID: number;
    AccountName: string;
    AccountType: string;
    AllocationAmount: number;
    BudgetAllocationDetails: BudgetAllocationDetail[];
}

export interface BudgetDetails {
    ID: number;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    Remarks: string;
    IsActive: boolean;
    IsBuiltIn: boolean;
    BudgetAllocationMasters: BudgetAllocationMaster[];
}

export interface BudgetDetailsRootModel {
    StatusCode: number;
    Message: string;
    Entity: BudgetDetails;
}