export interface ForgetPassword {
    email: string;
}

export interface ForgetPasswordRootModel {
    StatusCode: number;
    Message: string;
    Entity: ForgetPassword;
}
export interface ResetPassword {
    Token: string;
    Password: string;
    VerifyPassword: string;
}

export interface ResetPasswordRootModel {
    StatusCode: number;
    Message: string;
    Entity: ResetPassword;
}