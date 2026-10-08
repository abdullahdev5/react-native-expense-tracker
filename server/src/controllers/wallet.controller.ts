import { NextFunction, Request, Response } from "express";
import { responseHelper } from "../helpers/responseHelper";
import { CreateWalletDTO, CreateWalletRequestDTO, IWallet, WalletType } from "../types/wallet";
import { walletService } from "../services/wallet.service";
import { HttpError } from "../utils/errors.util";

// create wallet
const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!._id;
    const reqBody: CreateWalletRequestDTO = req.body;

    if (!reqBody.name || !reqBody.currency || !reqBody.type) {
      throw new HttpError("all fields are required!", 400);
    }

    const bodyData: CreateWalletDTO = {
      name: reqBody.name,
      currency: reqBody.currency.trim().toUpperCase(),
      type: reqBody.type.trim().toLowerCase() as WalletType,
      provider: reqBody.provider?.trim().toLowerCase() ?? null,
    };

    // Creating Wallet
    const wallet = await walletService.addWallet(
      userId.toString(),
      bodyData,
    );
    // sending response
    return responseHelper.sendSuccess(
      res,
      wallet,
      "wallet created successfully",
      201,
    );
  } catch (e: any) {
    next(e);
  }
};

// delete wallet
const deleteWallet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!._id;
    const walletId = req.params.id;
    if (!walletId) {
      throw new HttpError("unable to find the wallet!", 400);
    }
    // Deleting Wallet
    await walletService.deleteWallet(userId.toString(), walletId as string);
    // sending response
    return responseHelper.sendSuccess(
        res,
        null,
        "wallet deleted successfully"
    );
  } catch (e) {
    next(e);
  }
};

// get all wallets
const getAllWallets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!._id;
        const wallets = await walletService.getAllWallets(userId.toString());
        // sending response
        return responseHelper.sendSuccess(
            res,
            wallets,
            "wallets fetched successfully"
        );
    } catch (e: any) {
        next(e);
    }
}


// get Wallet
export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const walletId = req.params.id;

    if (!walletId) {
      return responseHelper.sendError(
        res,
        'Wallet ID is not provided!',
        400
      );
    }

    const wallet = await walletService.getWalletByID(userId.toString(), walletId as string);

    return responseHelper.sendSuccess(
      res,
      wallet,
      'Success',
    );
  } catch (e: any) {
    next(e);
  }
}


export { createWallet, deleteWallet, getAllWallets };