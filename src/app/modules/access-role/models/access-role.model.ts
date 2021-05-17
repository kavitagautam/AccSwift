export interface AccessRoles {
  ID: number;
  Name: string;
  IsBuiltIn: boolean;
  AccessRoleDetails: AccessRoleDetail[];
  CompanyID: number;
  Remarks: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface AccessRoleRootModel {
  StatusCode: number;
  Message: string;
  Entity: AccessRoles[];
}





export interface AccessRolesMin {
  ID: number;
  Name: string;
}

export interface AccessRoleMinRootModel {
  StatusCode: number;
  Message: string;
  Entity: AccessRolesMin[];
}





export interface Child2 {
  IsChecked: boolean;
  Code: string;
  Child: any[];
  ID: number;
  TypeOf: number;
  Title: string;
}

export interface Child {
  IsChecked: boolean;
  Code: string;
  Child: Child2[];
  ID: number;
  TypeOf: number;
  Title: string;
}

export interface Tree {
  IsChecked: boolean;
  Code: string;
  Child: Child[];
  ID: number;
  TypeOf: number;
  Title: string;
}

export interface AccessRoleTreeViewModel {
  Tree: Tree[];
  Node: string[];
}




export interface Access {
  ID: number;
  Name: string;
  Code: string;
  ParentID?: number;
  Description: string;
}

export interface AccessRoleDetail {
  ID: number;
  AccessID: number;
  RoleID: number;
  Access: Access;
}

export interface AccessRoles {
  ID: number;
  Name: string;
  IsBuiltIn: boolean;
  Remarks: string;
  AccessRoleDetails: AccessRoleDetail[];
  CompanyID: number;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy?: any;
  ModifiedDate?: any;
}

export interface AccessNavigate {
  Entity: AccessRoles;
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface AccessNavigateRootModel {
  StatusCode: number;
  Message: string;
  Entity: AccessNavigate
}
