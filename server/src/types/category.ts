import { Document, Types } from "mongoose";
import { TransactionType } from "./transaction";

export interface ICategory extends Document {
  userId?: Types.ObjectId | null;
  name: string;
  type: TransactionType;
  icon?: string | null;
  color: string;
  isDeleted: boolean;
  createdAt: Date;
}

export type CreateCategoryRequestDTO = {
  name?: string;
  type?: string;
  icon?: string;
  color?: string;
};
export type UpdateCategoryRequestDTO = {
  categoryId?: string;
  name?: string;
  icon?: string | null;
  color?: string;
};

export type CreateCategoryRequestPayload = {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
};
export type UpdateCategoryPayload = {
  categoryId: string;
  name?: string;
  icon?: string | null;
  color?: string;
};
