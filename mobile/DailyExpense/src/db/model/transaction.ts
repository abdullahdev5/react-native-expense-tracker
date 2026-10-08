import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import CategoryModel from './category';
import WalletModel from './wallet';


export default class TransactionModel extends Model {
    static table: string = 'transactions'
    static associations: Associations = {
        categories: { type: 'belongs_to', key: 'category_id' },
        wallets: { type: 'belongs_to', key: 'wallet_id' },
    };


    @field('title') title: string
    @field('description') description?: string | null
    @field('amount') amount: number
    @field('type') type: string
    @field('currency') currency: string
    @date('date') date: Date
    @field('merchant_name') merchantName: string
    @field('merchant_logo') merchantLogo?: string | null
    @date('updated_at') updatedAt: Date;
    @field('synced') synced: boolean;

    @field('category_id') categoryId: string
    @field('wallet_id') walletId: string

    @relation('categories', 'category_id') category: Relation<CategoryModel>
    @relation('wallets', 'wallet_id') wallet: Relation<WalletModel>
}