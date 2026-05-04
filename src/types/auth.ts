export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}