import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  picture?: string | null;
  provider: AuthProvider,
  providerId?: string,
  baseCurrency?: string | null;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}


export interface UserPayload {
    _id: Types.ObjectId,
    email: string
}

export interface RegisterUserRequestDTO {
  name?: string;
  email?: string;
  password?: string;
  baseCurrency?: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  baseCurrency: string;
}

export interface UpdateProfileRequestDTO {
  name?: string;
  picture?: string;
  baseCurrency?: string;
}

export interface UpdateProfileDTO {
  name?: string | undefined;
  picture?: Express.Multer.File | undefined;
  baseCurrency?: string;
};



export type AuthProvider = "google" | "facebook" | "email";