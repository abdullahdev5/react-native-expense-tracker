import { Model } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";


export default class CategoryModel extends Model {
    static table: string = 'categories';
    static associations: Associations = {
        transactions: { type: 'has_many', foreignKey: 'category_id' }
    };

    @field('name') name: string;
    @field('type') type: string;
    @field('icon') icon?: string | null;
    @field('color') color: string;
    @field('is_default') isDefault: boolean;
    @date('created_at') createdAt: Date;
    @date('updated_at') updatedAt: Date;
}