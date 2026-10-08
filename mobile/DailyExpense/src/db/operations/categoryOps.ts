import { map, Observable } from '@nozbe/watermelondb/utils/rx';
import database from '..';
import { Category } from '../../types/category';
import { assignCategoryToModel, mapDbModelToCategory } from '../mapper';
import CategoryModel from '../model/category';
import { Q } from '@nozbe/watermelondb';


export async function prepareCategoriesOps (
  categories: Category[],
): Promise<CategoryModel[]> {
  const catsCollection = database.get<CategoryModel>('categories');
  const existingCats = await catsCollection.query().fetch();
  const existingCatsMap = new Map(existingCats.map(cat => [cat.id, cat]));

  const batchOperations = categories.map(cat => {
    const existingCatModel = existingCatsMap.get(cat.id);

    if (existingCatModel) {
      return existingCatModel.prepareUpdate(record => {
        assignCategoryToModel(record, cat);
      });
    } else {
      return catsCollection.prepareCreate(record => {
        record._raw.id = cat.id;
        assignCategoryToModel(record, cat);
      });
    }
  });

  return batchOperations;
};

export const saveCategoriesToLocalDB = async (
  incomingCategories: Category[],
) => {
  if (!incomingCategories.length) return;

  await database.write(async () => {
    const catsOps = await prepareCategoriesOps(incomingCategories);
    await database.batch(...catsOps);
  });
};

export const getCategoriesFromLocalDB = async (): Promise<Category[]> => {
  const catsCollection = database.get<CategoryModel>('categories');
  const localCategories = await catsCollection.query(Q.sortBy('created_at', Q.desc)).fetch();

  return localCategories.map(mapDbModelToCategory);
};

export const observeCategoriesFromLocalDB = (): Observable<Category[]> => {
  return database
    .get<CategoryModel>('categories')
    .query(Q.sortBy('created_at', Q.desc))
    .observe()
    .pipe(map(models => models.map(mapDbModelToCategory)));
};
