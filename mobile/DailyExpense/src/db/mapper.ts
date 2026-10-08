import { Category, CategoryColor, CategoryIcon } from "../types/category";
import { Transaction, TransactionType } from "../types/transaction";
import { CurrencyCode } from "../types/types";
import { AllWalletProviders, Wallet, WalletType } from "../types/wallet";
import CategoryModel from "./model/category";
import TransactionModel from "./model/transaction";
import WalletModel from "./model/wallet";



// Transaction
export const mapDbModelToTransaction = async (model: TransactionModel): Promise<Transaction> => {
    const categoryDbModel = await model.category.fetch();
    const walletDbModel = await model.wallet.fetch();

    return {
        id: model.id,
        title: model.title,
        description: model.description,
        amount: model.amount,
        categoryId: model.categoryId,
        category: categoryDbModel
        ? {
            id: categoryDbModel.id,
            name: categoryDbModel.name,
            icon: categoryDbModel.icon as CategoryIcon,
            color: categoryDbModel.color as CategoryColor
        } : null,
        walletId: model.walletId,
        wallet: walletDbModel
        ? {
            id: walletDbModel.id,
            name: walletDbModel.name,
            currency: walletDbModel.currency as CurrencyCode,
            type: walletDbModel.type as WalletType,
            provider: walletDbModel.provider as AllWalletProviders
        } : null,
        type: model.type as TransactionType,
        currency: model.currency as CurrencyCode,
        date: model.date,
        merchantName: model.merchantName,
        merchantLogo: model.merchantLogo,
        updatedAt: model.updatedAt
    };
};

export const assignTransactionToModel = (record: TransactionModel, tx: Transaction) => {
    record.title = tx.title;
    record.description = tx.description || null;
    record.amount = tx.amount;
    record.categoryId = tx.categoryId;
    record.walletId = tx.walletId;
    record.type = tx.type;
    record.currency = tx.currency;
    record.date = tx.date instanceof Date ? tx.date : new Date(tx.date);
    record.merchantName = tx.merchantName;
    record.merchantLogo = tx.merchantLogo || null;
    record.updatedAt = tx.updatedAt instanceof Date ? tx.updatedAt : new Date(tx.updatedAt);
};



// Category

export const mapDbModelToCategory = (model: CategoryModel): Category => {
    return {
        id: model.id,
        name: model.name,
        type: model.type as TransactionType,
        icon: model.icon as CategoryIcon | null,
        color: model.color as CategoryColor,
        isDefault: model.isDefault,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
    };
};

export const assignCategoryToModel = (record: CategoryModel, cat: Category) => {
    record.name = cat.name;
    record.type = cat.type;
    record.icon = cat.icon || null;
    record.color = cat.color;
    record.isDefault = cat.isDefault;
    record.createdAt = cat.createdAt instanceof Date ? cat.createdAt : new Date(cat.createdAt);
    record.updatedAt = cat.updatedAt instanceof Date ? cat.updatedAt : new Date(cat.updatedAt);
};




// Wallet

export const mapDbModelToWallet = (model: WalletModel): Wallet => {
    return {
        id: model.id,
        name: model.name,
        balance: model.balance,
        currency: model.currency,
        type: model.type as WalletType,
        provider: model.provider as AllWalletProviders | null | undefined,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
    };
};

export const assignWalletToModel = (record: WalletModel, wallet: Wallet) => {
    record.name = wallet.name;
    record.balance = wallet.balance;
    record.currency = wallet.currency;
    record.type = wallet.type;
    record.provider = wallet.provider || null;
    record.createdAt = wallet.createdAt instanceof Date ? wallet.createdAt : new Date(wallet.createdAt);
    record.updatedAt = wallet.updatedAt instanceof Date ? wallet.updatedAt : new Date(wallet.updatedAt);
};
