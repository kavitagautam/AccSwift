export interface User {
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
    ModifiedDate: Date;
    UserStatus: number;
    IsBuiltIn: boolean;
    CompanyID: number;
}

export interface UserRootModel {
    StatusCode: number;
    Message: string;
    Entity: User;
}