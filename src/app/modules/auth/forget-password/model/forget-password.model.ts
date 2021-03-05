export interface ForgetPassword {
    email: string;
}

export interface ForgetPasswordRootModel {
    StatusCode: number;
    Message: string;
    Entity: ForgetPassword;
}