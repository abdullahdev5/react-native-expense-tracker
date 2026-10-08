import { appSchema, tableSchema } from "@nozbe/watermelondb";


export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'type', type: 'string' },
                { name: 'currency', type: 'string' },
                { name: 'date', type: 'number' },
                { name: 'merchant_name', type: 'string' },
                { name: 'merchant_logo', type: 'string' },
                // { name: 'updated_at', type: 'number', isOptional: true },
                { name: 'updated_at', type: 'number' },

                { name: 'category_id', type: 'string', isIndexed: true },
                { name: 'wallet_id', type: 'string', isIndexed: true },
            ]
        }),
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'icon', type: 'string', isOptional: true },
                { name: 'color', type: 'string' },
                { name: 'is_default', type: 'boolean' },
                { name: 'created_at', type: 'number' },
                // { name: 'updated_at', type: 'number', isOptional: true },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'wallets',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'provider', type: 'string', isOptional: true },
                { name: 'balance', type: 'number' },
                { name: 'currency', type: 'string' },
                { name: 'created_at', type: 'number' },
                // { name: 'updated_at', type: 'number', isOptional: true },
                { name: 'updated_at', type: 'number' },
            ]
        })
    ]
});