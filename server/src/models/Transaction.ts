import mongoose, { QueryFilter, Types } from "mongoose";
import {
  ITransaction,
  ITransactionModel,
  ITransactionQueryHelpers,
  TransactionResponse,
  TransactionType,
  TransactionTypes,
} from "../types/transaction";
import { COLLECTION_NAMES, MODEL_NAMES } from "../constants/dbConstants";

const transactionSchema = new mongoose.Schema<
  ITransaction,
  ITransactionModel,
  // mongoose.Model<ITransaction, ITransactionQueryHelpers, {}>,
  {},
  ITransactionQueryHelpers
>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    amount: { type: Number, required: true, min: 0 },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: MODEL_NAMES.CATEGORY,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionTypes),
    },
    date: { type: Date, default: Date.now },
    currency: {
      type: String,
      required: true,
      uppercase: true,
    },
    walletId: {
      type: mongoose.Schema.ObjectId,
      ref: MODEL_NAMES.WALLET,
      required: true,
    },
    merchantName: { type: String, trim: true },
    merchantLogo: {
      type: String,
      default: null,
      trim: true,
    },
    // merchantName: String,
    // location: String,
    // notes: String,
    // tags: [String],
    // isRecurring: {
    //     type: Boolean,
    //     default: false
    // },
    // receiptImage: String,
    // aiCategory: String,
    // aiInsight: String,
    // aiAnomaly: Boolean,
    // importantScore: Number,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
    toObject: {
      transform: function (_, ret: any) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.userId;

        return ret;
      },
    },
  },
);

/* Query Methods */
transactionSchema.query.query = function (
  // this: mongoose.Query<
  //   mongoose.HydratedDocument<ITransaction>[],
  //   mongoose.HydratedDocument<ITransaction>,
  //   ITransactionQueryHelpers
  // >,
  // filters: QueryFilter<ITransaction>,
  this: any,
  filters: any,
) {
  if (filters.title) {
    this.where({
      title: { $regex: filters.title, $options: "i" },
    });
  }

  if (filters.type) {
    this.where({ type: filters.type });
  }

  if (filters.categoryId) {
    this.where({ categoryId: filters.categoryId });
  }

  if (filters.startDate && filters.endDate) {
    this.where({
      date: {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      },
    });
  }

  return this;
};

transactionSchema.query.populateCategory = function (this: any) {
  return this.populate("categoryId", "name type icon color createdAt");
};

transactionSchema.query.populateWallet = function (this: any) {
  return this.populate(
    "walletId",
    "name type provider balance currency createdAt",
  );
};

transactionSchema.query.populateAll = function (this: any) {
  return this.populateCategory().populateWallet();
};

/* Statics Methods */
// transactionSchema.statics.getWithDetails = async function ({
//   // userId,
//   // id,
//   query,
//   page = 1,
//   limit = 5,
// }: {
//   // userId: string;
//   // id: string;
//   query?: Record<string, any>;
//   page?: number;
//   limit?: number;
// }): Promise<TransactionResponse> {
//   const sanitizedQuery = { ...query };

//   if (sanitizedQuery.userId) {
//     sanitizedQuery.userId = new mongoose.Types.ObjectId(sanitizedQuery.userId);
//   }

//   if (sanitizedQuery._id) {
//     sanitizedQuery._id = new mongoose.Types.ObjectId(sanitizedQuery._id);
//   }

//   const result = await this.aggregate([
//     { $match: sanitizedQuery },

//     { $sort: { createdAt: -1 } },

//     {
//       $facet: {
//         metadata: [{ $count: "total" }],
//         data: [
//           { $skip: (page - 1) * limit },
//           { $limit: limit },

//           // CATEGORY
//           {
//             $lookup: {
//               from: COLLECTION_NAMES.categories,
//               localField: "categoryId",
//               foreignField: "_id",
//               as: "category",
//             },
//           },
//           // { $unwind: "$category" },
//           { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

//           // WALLET
//           {
//             $lookup: {
//               from: COLLECTION_NAMES.wallets,
//               localField: "walletId",
//               foreignField: "_id",
//               as: "wallet",
//             },
//           },
//           { $unwind: { path: "$wallet", preserveNullAndEmptyArrays: true } },

//           // FINAL SHAPE
//           {
//             $addFields: {
//               id: "$_id",

//               categoryId: "$category._id",
//               walletId: "$wallet._id",

//               category: {
//                 $cond: {
//                   if: { $not: ["$category"] },
//                   then: null,
//                   else: {
//                     id: "$category._id",
//                     name: "$category.name",
//                     color: "$category.color",
//                     icon: "$category.icon",
//                   },
//                 },
//               },

//               wallet: {
//                 $cond: {
//                   if: { $not: ["$wallet"] },
//                   then: null,
//                   else: {
//                     id: "$wallet._id",
//                     name: "$wallet.name",
//                     type: "$wallet.type",
//                     provider: "$wallet.provider",
//                     currency: "$wallet.currency",
//                   },
//                 },
//               },
//             },
//             // $project: {
//             //   id: "$_id",
//             //   title: 1,
//             //   amount: 1,
//             //   type: 1,
//             //   currency: 1,
//             //   date: 1,

//             //   categoryId: "$category._id",
//             //   walletId: "$wallet._id",

//             //   category: {
//             //     id: "$category._id",
//             //     name: "$category.name",
//             //     color: "$category.color",
//             //     icon: "$category.icon"
//             //   },

//             //   wallet: {
//             //     id: "$wallet._id",
//             //     name: "$wallet.name",
//             //     type: "$wallet.type",
//             //     provider: "$wallet.provider",
//             //     currency: "$wallet.currency"
//             //   },

//             //   merchantName: 1,
//             //   merchantLogo: 1
//             // }
//           },
//         ],
//       },
//     },
//   ]);

//   const total = result[0]?.metadata[0]?.total ?? 0;
//   const data = result[0]?.data ?? [];

//   return {
//     data,
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };

transactionSchema.statics.getWithDetails = async function (
  options: {
    query: Record<string, any>;
    lastSyncedAt?: Date | number | null;
  }
): Promise<any[]> {
  const sanitizedQuery = { ...options.query };

  if (sanitizedQuery.userId) {
    sanitizedQuery.userId = new mongoose.Types.ObjectId(sanitizedQuery.userId);
  }

  if (sanitizedQuery._id) {
    sanitizedQuery._id = new mongoose.Types.ObjectId(sanitizedQuery._id);
  }

  if (options.lastSyncedAt) {
    const syncDate = new Date(options.lastSyncedAt);

    sanitizedQuery.updatedAt = { $gte: syncDate }
  }

  const result = await this.aggregate([
    { $match: sanitizedQuery },

    { $sort: { date: -1 } },

    // CATEGORY
    {
      $lookup: {
        from: COLLECTION_NAMES.categories,
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    // { $unwind: "$category" },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    // WALLET
    {
      $lookup: {
        from: COLLECTION_NAMES.wallets,
        localField: "walletId",
        foreignField: "_id",
        as: "wallet",
      },
    },
    { $unwind: { path: "$wallet", preserveNullAndEmptyArrays: true } },

    // FINAL SHAPE
    {
      $addFields: {
        id: "$_id",

        categoryId: "$category._id",
        walletId: "$wallet._id",

        category: {
          $cond: {
            if: { $not: ["$category"] },
            then: null,
            else: {
              id: "$category._id",
              name: "$category.name",
              color: "$category.color",
              icon: "$category.icon",
            },
          },
        },

        wallet: {
          $cond: {
            if: { $not: ["$wallet"] },
            then: null,
            else: {
              id: "$wallet._id",
              name: "$wallet.name",
              type: "$wallet.type",
              provider: "$wallet.provider",
              currency: "$wallet.currency",
            },
          },
        },
      },
    },
  ]);

  return result;
};

export const Transaction = mongoose.model<
  ITransaction,
  ITransactionModel
  // mongoose.Model<ITransaction, ITransactionQueryHelpers, {}>
>(MODEL_NAMES.TRANSACTION, transactionSchema);
