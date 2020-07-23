export interface ProductGroup {
  ID: number;
  ParentGroupID: number;
  ParentGroupName: string;
  Name: string;
  BackColor: number;
  CompanyID: number;
  Remarks: string;
  CreatedBy?: any;
  CreatedDate?: any;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface ProductGroupModel {
  StatusCode: number;
  Message: string;
  Entity: ProductGroup[];
}

export interface ProductGroupDetailModel {
  StatusCode: number;
  Message: string;
  Entity: ProductGroup;
}
