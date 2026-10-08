import { Model } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";


export default class WalletModel extends Model {
    static table: string = 'wallets';
    static associations: Associations = {
        transactions: { type: 'has_many', foreignKey: 'wallet_id' }
    };

    @field('name') name: string
    @field('type') type: string
    @field('provider') provider?: string | null
    @field('balance') balance: number
    @field('currency') currency: string;
    @date('created_at') createdAt: Date
    @date('updated_at') updatedAt: Date;
}