import {
  CreateTransactionDTO,
  CreateTransactionRequestDTO,
  ITransaction,
  TransactionResponse,
  TransactionType,
} from "../types/transaction";
import { NextFunction, Request, Response } from "express";
import { responseHelper } from "../helpers/responseHelper";
import { transactionService } from "../services/transaction.service";

const pushTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!._id;
    const transactionsDTO = req.body as Array<CreateTransactionRequestDTO>;

    if (!Array.isArray(transactionsDTO) || transactionsDTO.length === 0) {
      return responseHelper.sendError(
        res,
        'Transactions payload must be a non-empty array!',
        400
      );
    }

    const validatedBodyData: CreateTransactionDTO[] = [];

    for (let i = 0; i < transactionsDTO.length; i++) {
      const item = transactionsDTO[i];

      // Validate required fields per item
      if (
        !item ||
        !item.id || // Client-generated ObjectId/UUID
        !item.title ||
        item.amount == null ||
        !item.categoryId ||
        !item.type ||
        !item.walletId ||
        !item.merchantName
      ) {
        return responseHelper.sendError(
          res,
          `Invalid payload at index ${i}: All required fields (id, title, amount, categoryId, type, walletId, merchantName) must be provided!`,
          400,
        );
      }

      validatedBodyData.push({
        id: item.id,
        title: item.title,
        description: item.description || null,
        amount: item.amount,
        categoryId: item.categoryId,
        type: item.type as TransactionType,
        walletId: item.walletId,
        merchantName: item.merchantName,
        date: new Date(item.date ?? Date.now()),
      });
    }



    // const {
    //   title,
    //   description,
    //   amount,
    //   categoryId,
    //   type,
    //   walletId,
    //   merchantName,
    //   date,
    // }: CreateTransactionRequestDTO = req.body;

    // if (
    //   !title ||
    //   amount == null ||
    //   !categoryId ||
    //   !type ||
    //   !walletId ||
    //   !merchantName
    // ) {
    //   return responseHelper.sendError(res, "all fields required!", 400);
    // }


    // const bodyData: CreateTransactionDTO[] = {
    //   title: title,
    //   description: description || null,
    //   amount: amount,
    //   categoryId: categoryId,
    //   type: type as TransactionType,
    //   walletId: walletId,
    //   merchantName: merchantName,
    //   date: new Date(date ?? Date.now()),
    // };

    const { transactions, syncTime } = await transactionService.pushTransactionsBulk(
      userId.toString(),
      validatedBodyData,
    );
    
    // Sending Response
    return responseHelper.sendSuccess(
      res,
      { 
        transactions,
        syncTime
      },
      "Transaction Created Successfully",
      201,
    );
  } catch (e: any) {
    next(e);
  }
};

// const getTransactions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { includeDetails, page = 1, limit = 10, query } = req.query;
//     const userId = req.user!._id;

//     let result: PaginatedTransactionsResponse | null = null;

//     if (includeDetails === "true") {
//       console.log(`Transactions with populate ids:`);

//       result = await transactionService.getTransactionsWithDetails(
//         userId.toString(),
//         Number(page),
//         Number(limit),
//       );
//     } else {
//       console.log(`Transactions without populate ids:`);
//       // default
//       result = await transactionService.getTransactions(
//         userId.toString(),
//         Number(page),
//         Number(limit),
//       );
//     }

//     console.log(`Fetch Transactions: ${JSON.stringify(result)}`);

//     return responseHelper.sendSuccess(
//       res,
//       result,
//       "Transaction Fetched Successfully",
//     );
//   } catch (e: any) {
//     next(e);
//   }
// };

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { includeDetails = 'true', query } = req.query;
    const userId = req.user!._id;

    const lastSyncedAt = req.query.lastSyncedAt
      ? new Date(Number(req.query.lastSyncedAt))
      : null;

    const syncTimestamp = Date.now();

    let result: TransactionResponse | null = null;

    const transactions = await transactionService.getTransactions({
      userId: userId.toString(),
      query: query,
      lastSyncedAt,
      includeDetails: typeof includeDetails === 'string' ? includeDetails.toLowerCase() === 'true' : false
    });


    result = {
      data: transactions,
      syncTimestamp
    };

    console.log(`Fetch Transactions: ${JSON.stringify(result)}`);

    return responseHelper.sendSuccess(
      res,
      result,
      "Transaction Fetched Successfully",
    );
  } catch (e: any) {
    next(e);
  }
};


const exportTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const transactionIds = req.body;

    if (!transactionIds) {
      return responseHelper.sendError(
        res,
        'Please select the transactions you want to export!',
      );
    }

    const csvContent = await transactionService.exportTransactions(transactionIds, userId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dailyepense_transactions.csv');

    res.status(200).send(csvContent);

  } catch(e) {
    next(e);
  }
}


export { pushTransaction as createTransaction, getTransactions, exportTransactions };
