import { ApiResponse } from "./api";

/* Models */
export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string | null;
    provider: AuthProvider;
    providerId: string;
    baseCurrency?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthData {
    token: string;
    user: User;
}


/* Server DTO's */
export interface UserDTO {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    provider?: AuthProvider;
    providerId?: string;
    baseCurrency?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthDataDTO {
    token?: string;
    user?: UserDTO;
}


/* Types */
export type AuthProvider = 'google' | 'facebook' | 'email';

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    picture?: string | undefined;
    baseCurrency: string;
}

export type LoginPayload = {
    email: string;
    password: string;
}

export type AuthMetadata = {
    baseCurrency: string;
}