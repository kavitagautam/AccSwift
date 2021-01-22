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
    