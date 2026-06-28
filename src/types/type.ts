export interface Credentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface FormRegister extends Credentials {
    username: string;
    repeatPassword: string;
}
