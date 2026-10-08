import mongoose, { Query } from "mongoose";
import { MODEL_NAMES } from "../constants/dbConstants";
import bcrypt from "bcrypt";
import { AuthProvider, IUser, IUserMethods } from "../types/user";

const userSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    createdAt: { type: Date, default: Date.now() },
    picture: { type: String, default: null },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'email']
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true
    },
    baseCurrency: {
      type: String,
      default: null,
      trim: true,
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();
        
        delete ret._id;
        delete ret.__v;
      }
    }
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Model
export const User = mongoose.model<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>
>(MODEL_NAMES.USER, userSchema);
