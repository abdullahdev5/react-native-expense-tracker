import {
  CreateTransactionDTO,
  ITransaction,
  SupportedTransactionImportMimeType,
  TransactionDTO,
  TransactionOptions,
  TransactionResponse,
  TransactionType,
  TransactionsPushResponse
} from "../types/transaction";
import { socketService } from "./socket.service";
import { Wallet } from "../models/Wallet";
import { Transaction } from "../models/Transaction";
import { HttpError } from "../utils/errors.util";
import { AnyBulkWriteOperation, connection, ObjectId, Types } from "mongoose";
import { dashboardService } from "./dashboard.service";
import { SOCKET_EVENTS } from "../constants/socketEvents";
import {
  getMerchantLogoDomain,
  getMerchantLogoUrl,
} from "../utils/transaction.utils";
import { User } from "../models/User";
import { walletService } from "./wallet.service";
import { insightService } from "./insight.service";
import Papa from 'papaparse';
import * as  XLSX from 'xlsx';
import { info } from "node:console";


class TransactionService {
  // Push Transactions Bulk
  public async pushTransactionsBulk(
    userId: string,
    data: CreateTransactionDTO[],
  ): Promise<TransactionsPushResponse> {
    const userObjectId = new Types.ObjectId(userId);

    let session: any = null;
    const useTransactions = process.env.NODE_ENV === "production";

    if (useTransactions) {
      session = await connection.startSession();
      session.startTransaction();
    }

    try {
      // 1. Pre-fetch and cache Wallets affected by this batch to avoid redundant DB calls
      const walletIds = [
        ...new Set(data.map((item) => item.walletId.toString())),
      ];
      const wallets = await Wallet.find({
        _id: { $in: walletIds.map((id) => new Types.ObjectId(id)) },
        userId: userObjectId,
      }).session(session);

      const walletMap = new Map<string, any>();
      wallets.forEach((w) => walletMap.set(w._id.toString(), w));

      // Ensure all referenced wallets exist
      for (const wId of walletIds) {
        if (!walletMap.has(wId)) {
          throw new HttpError(`Unable to find wallet with ID: ${wId}`, 400);
        }
      }

      // 2. Prepare bulk operations & fetch logos concurrently
      const bulkOps: AnyBulkWriteOperation<ITransaction>[] = [];
      const processedTxIds: Types.ObjectId[] = [];
      const syncTime: number = Date.now();
      const serverSyncDate = new Date(syncTime);

      for (const item of data) {
        const txId = new Types.ObjectId(item.id);
        const wallet = walletMap.get(item.walletId.toString());

        // Update local wallet balance in memory (and DB)
        await wallet.updatebalance(item.type, item.amount, session);

        // Fetch Merchant Logo
        const merchantLogoDomain = getMerchantLogoDomain(item.merchantName);
        const merchantLogoUrl = await getMerchantLogoUrl(merchantLogoDomain);

        processedTxIds.push(txId);

        // Build Upsert Operation (Idempotent: safe against retries)
        bulkOps.push({
          updateOne: {
            filter: { _id: txId, userId: userObjectId },
            update: {
              $set: {
                title: item.title,
                description: item.description || null,
                amount: item.amount,
                type: item.type,
                currency: wallet.currency,
                categoryId: new Types.ObjectId(item.categoryId),
                walletId: wallet._id,
                merchantName: item.merchantName,
                merchantLogo: merchantLogoUrl,
                date: new Date(item.date ?? Date.now()),
                updatedAt: serverSyncDate,
              },
              $setOnInsert: {
                _id: txId,
                userId: userObjectId,
                createdAt: serverSyncDate
              }
            },
            upsert: true,
          },
        });
      }

      // 3. Execute bulk write to DB
      if (session) {
        await Transaction.bulkWrite(bulkOps, { session });
        await session.commitTransaction();
        session.endSession();
      } else {
        await Transaction.bulkWrite(bulkOps);
      }

      // 4. Fetch enriched items to return to client & trigger socket events
      const result = await Transaction.getWithDetails({
        query: {
          userId: userObjectId,
          _id: { $in: processedTxIds },
        },
      });

      // 5. Socket Emissions (Non-blocking / Background safe)
      try {
        const user = await User.findById(userObjectId);
        if (user && user.baseCurrency) {
          // Broadcast updates for affected wallets & dashboard
          const socketPromises: any[] = [
            dashboardService.emitDashboardUpdate(userId, user.baseCurrency),
          ];

          // Emit updated wallet balances
          walletMap.forEach((wallet) => {
            socketPromises.push(walletService.emitWalletUpdate(userId, wallet));
          });

          // Emit events for new transactions
          result.forEach((txDoc: any) => {
            socketPromises.push(
              socketService.emitToUser<TransactionDTO>(
                userId,
                "new_transaction",
                txDoc,
              ),
              insightService.emitInsightUpdate(userId, {
                period: "daily",
                type: txDoc.type,
              }),
            );
          });

          await Promise.all(socketPromises);
        }
      } catch (socketError) {
        console.log("Socket emission failed: ", socketError);
      }

      // Return array of processed transactions (populated with merchant logos, etc.)
      return {
        transactions: result,
        syncTime,
      };
    } catch (e) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw e;
    }
  }

  // public async pushTransactionsBulk(userId: string, data: CreateTransactionDTO[]) {
  //   const walletObjectId = new Types.ObjectId(data.walletId);
  //   const userObjectId = new Types.ObjectId(userId);

  //   let session: any = null;
  //   const useTransactions = process.env.NODE_ENV === "production"; // Set to true only in production

  //   if (useTransactions) {
  //     session = await connection.startSession();
  //     session.startTransaction();
  //   }

  //   try {
  //     // Get the Wallet
  //     const wallet = await Wallet.findOne({
  //       _id: walletObjectId,
  //       userId: userObjectId,
  //     }).session(session);

  //     if (!wallet) {
  //       throw new HttpError("unable to find the wallet!", 400);
  //     }

  //     // Updating Balance
  //     await wallet.updatebalance(data.type, data.amount, session);

  //     // Updating Merchant Logo
  //     const merchantLogoDomain = getMerchantLogoDomain(data.merchantName);
  //     const merchantLogoUrl = await getMerchantLogoUrl(merchantLogoDomain);

  //     console.log("Merchant Name: ", data.merchantName);
  //     console.log("Generated Merchant Domain: ", merchantLogoDomain);
  //     console.log("Final Merchant Logo Url: ", merchantLogoUrl);

  //     // Adding Transaction
  //     let transaction;
  //     const transactionDoc = {
  //       userId: userObjectId,
  //       ...data,
  //       currency: wallet.currency,
  //       merchantLogo: merchantLogoUrl,
  //       categoryId: new Types.ObjectId(data.categoryId),
  //       walletId: walletObjectId,
  //     };

  //     if (session) {
  //       const createdTransactions = await Transaction.create([transactionDoc], {
  //         session,
  //       });
  //       transaction = createdTransactions[0]!;
  //     } else {
  //       transaction = await Transaction.create(transactionDoc);
  //     }

  //     // 5. Safely commit only if session exists
  //     if (session) {
  //       await session.commitTransaction();
  //       session.endSession();
  //     }

  //     // Emit the Dashboard Data & New Transaction to the Socket User
  //     try {
  //       const user = await User.findById({ _id: userObjectId });
  //       const result = await Transaction.getWithDetails({
  //         query: {
  //           userId: user?._id,
  //           _id: transaction._id,
  //         },
  //       });
  //       const newTransactionObj = result[0] as unknown as TransactionDTO;

  //       if (user && user.baseCurrency) {
  //         await Promise.all([
  //           socketService.emitToUser<TransactionDTO>(
  //             userId,
  //             "new_transaction",
  //             newTransactionObj,
  //           ),
  //           dashboardService.emitDashboardUpdate(userId, user.baseCurrency),
  //           walletService.emitWalletUpdate(userId, wallet),
  //           insightService.emitInsightUpdate(userId, {
  //             period: "daily",
  //             type: transaction.type,
  //           }),
  //         ]);
  //       }
  //     } catch (socketError) {
  //       console.log("Socket emission failed: ", socketError);
  //     }

  //     console.log(
  //       "Transaction is Added: ",
  //       JSON.stringify(transaction.toObject()),
  //     );

  //     return transaction;
  //   } catch (e) {
  //     if (session) {
  //       await session.abortTransaction();
  //       session.endSession();
  //     }

  //     throw e;
  //   }
  // }

  // public async getTransactions(
  //   userId: string,
  //   page: number,
  //   limit: number,
  // ): Promise<TransactionResponse> {
  //   const skipAmount = (page - 1) * limit;
  //   const userObjectId = new Types.ObjectId(userId);

  //   const [data, total] = await Promise.all([
  //     Transaction.find({ user: userObjectId }).sort({ date: -1 }).skip(skipAmount).limit(limit),
  //     Transaction.countDocuments(),
  //   ]);

  //   // return {
  //   //   data,
  //   //   meta: {
  //   //     total,
  //   //     page,
  //   //     limit,
  //   //     totalPages: Math.ceil(total / limit)
  //   //   }
  //   // }
  // }

  public async getTransactions({
    includeDetails = true,
    ...options
  }: TransactionOptions): Promise<any[]> {
    if (includeDetails === true) {
      return Transaction.getWithDetails({
        query: { userId: options.userId, ...options.query },
        lastSyncedAt: options.lastSyncedAt,
      });
    } else {
      let sanitizedQuery: Record<string, any> = {
        userId: new Types.ObjectId(options.userId),
        ...options.query,
      };

      if (options.lastSyncedAt) {
        sanitizedQuery.updatedAt = { $gte: options.lastSyncedAt };
      }

      return Transaction.aggregate([
        { $match: sanitizedQuery },
        { $sort: { date: -1 } },
      ]);
    }
  }

  // public async getTransactionsWithDetails(userId: string, page: number, limit: number): Promise<TransactionResponse> {
  //   return Transaction.getWithDetails({
  //     query: { userId: userId },
  //     page: page,
  //     limit: limit,
  //   });
  // }

  // public async getTransactionsWithDetails(
  //   userId: string,
  //   lastSyncedAt: Date | number | null,
  // ) {
  //   return Transaction.getWithDetails({
  //     query: { userId: userId },
  //     lastSyncedAt,
  //   });
  // }

  public async parseImportedTransaction(file: Express.Multer.File) {
    let rawRows = [];

    const typedMimeType = file.mimetype as SupportedTransactionImportMimeType;

    // application/json
    if (typedMimeType === 'application/json') {
      const jsonString = file.buffer.toString('utf-8');
      const parsedJson = JSON.parse(jsonString);

      rawRows = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
    }

    // text/csv
    else if (typedMimeType === 'text/csv' || typedMimeType === 'application/csv') {
      const csvString = file.buffer.toString('utf-8');

      Papa.parse(csvString, { header: true, skipEmptyLines: true });
    }

    // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    else if (typedMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' })

      const firstSheetName = workbook.SheetNames[0];

      if (firstSheetName) {        
        const worksheet = workbook.Sheets[firstSheetName];

        if (worksheet) {
          rawRows = XLSX.utils.sheet_to_json(worksheet);
        }
      }
    }

    // application/pdf
    else if (typedMimeType === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });

      const textResult = await parser.getText();

      const parsedData = JSON.parse(textResult.)
    }
  }
}

export const transactionService = new TransactionService();
