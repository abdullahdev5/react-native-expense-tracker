import jwt from 'jsonwebtoken';
import { UserPayload } from "../types/user";
import { HttpError } from "./errors.util";

// generate jwt token
export const generateJwtToken = (user: UserPayload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new HttpError("JWT_SECRET is missing in the environment variables!");
  }

  return jwt.sign({ _id: user._id, email: user.email }, secret, {
    expiresIn: "1d",
  });
};