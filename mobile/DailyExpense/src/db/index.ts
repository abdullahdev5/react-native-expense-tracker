import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from "./model/schema";
import TransactionModel from "./model/transaction";
import CategoryModel from "./model/category";
import WalletModel from "./model/wallet";
import { Database } from '@nozbe/watermelondb';
import migrations from './model/migration';


const adapter = new SQLiteAdapter({
    schema,

    migrations,

    onSetUpError: (error) => {

    }
});

const database = new Database({
    adapter,
    modelClasses: [
        TransactionModel,
        CategoryModel,
        WalletModel
    ]
});

export default database