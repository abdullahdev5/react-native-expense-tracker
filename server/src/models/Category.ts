import mongoose from "mongoose";
import { ICategory } from "../types/category";
import { MODEL_NAMES } from "../constants/dbConstants";
import { TransactionType } from "../types/transaction";

const categorySchema = new mongoose.Schema<
  ICategory,
  mongoose.Model<ICategory, {}, {}>,
  {}
>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      default: null,
      ref: MODEL_NAMES.USER,
    },
    name: { type: String, required: true, trim: true },
    type: {
      /// 'income' or 'expense'
      type: String,
      required: true,
      trim: true,
      enum: ["income", "expense"],
    },
    icon: { type: String, default: null, trim: true },
    color: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        ret.isDefault = ret.userId === null;

        delete ret.isDeleted;
        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
    toObject: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        ret.isDefault = ret.userId === null;

        delete ret.isDeleted;
        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
  },
);

// Prevents Duplicate when adding
categorySchema.index(
  { name: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

export const Category = mongoose.model<
  ICategory,
  mongoose.Model<ICategory, {}, {}>
>(MODEL_NAMES.CATEGORY, categorySchema);
