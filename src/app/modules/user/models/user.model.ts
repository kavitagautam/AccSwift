export interface Users {
  Password: string;
  UserID: number;
  UserName: string;
  Name: string;
  Address: string;
  Contact: string;
  Email: string;
  Department: string;
  AccessRoleID: number;
  AccessRoleName: string;
  AccClassID: number;
  AccClassName: string;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate?: Date;
  UserStatus: number;
  CompanyID: number;
}

export interface UserRootModel {
  StatusCode: number;
  Message: string;
  Entity: Users;
}

export interface UserNavigate {
  Entity: Users[];
  ItemsPerPage: number;
  ItemsReturned: number;
  TotalItemsAvailable: number;
  CurrentPage: number;
  TotalPages: number;
}

export interface UserNavigateModel {
  StatusCode: number;
  Message: string;
  Entity: UserNavigate;
}

export interface AccessRoles {
  ID: number;
  Name: string;
}

export interface AccessRoleRootModel {
  StatusCode: number;
  Message: string;
  Entity: AccessRoles[];
}
