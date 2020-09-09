export interface AccessRoles {
  ID: number;
  Name: string;
  IsBuiltIn: boolean;
  AccessRoleDetails?: any;
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
