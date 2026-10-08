import {
  addCategoryApi,
  deleteCategoryApi,
  getAllCategoriesApi,
} from '../api/category.api';
import { fakeCategoriesData } from '../constants/categoryConstants';
import { ApiResponse } from '../types/api';
import { Category, CreateCategoryPayload } from '../types/category';
import { errorResponse, getErrorMessage } from '../utils/error';
import { mapCategory } from '../utils/mapper';

export const createCategoryService = async (
  data: CreateCategoryPayload,
): Promise<Category | null> => {
  const res = await addCategoryApi(data);

  if (!res.success) {
    throw new Error(res.message || 'failed to create the Category!');
  }

  return res.data ? mapCategory(res.data) : null;
};

// export const createCategoryService = async (
//   data: CreateCategoryPayload,
// ): Promise<ApiResponse<Category>> => {
//   try {
//     const res = await addCategoryApi(data);

//     return {
//       ...res,

//       data: res.data ? mapCategory(res.data) : undefined,
//     };
//   } catch (e: any) {
//     return errorResponse({
//       message: getErrorMessage(e),
//     });
//   }
// };

export const getAllCategoriesService = async (): Promise<Category[]> => {
  const res = await getAllCategoriesApi();

  if (!res.success || !res.data) {
    throw new Error(res.message || 'No Categories found!');
  }

  return res.data.map(mapCategory);
};

// export const getAllCategoriesService = async (): Promise<ApiResponse<Category[]>> => {
//   try {
//     const res = await getAllCategoriesApi();

//     const mappedData = res.data?.map(mapCategory);

//     return {
//       ...res,

//       data: mappedData,
//     };
//   } catch (e) {
//     return errorResponse({ message: getErrorMessage(e) });
//   }
// };

export const deleteCategoryService = async (
  id: string,
): Promise<Category | null> => {
  const res = await deleteCategoryApi(id);

  if (!res.success) {
    throw new Error(res.message || 'failed to delete the Category!');
  }

  return res.data ? mapCategory(res.data) : null;
};
// export const deleteCategoryService = async (id: string): Promise<ApiResponse<Category>> => {
//   try {
//     const res = await deleteCategoryApi(id);

//     return {
//       ...res,

//       data: res.data ? mapCategory(res.data) : undefined
//     };
//   } catch (e) {
//     return errorResponse({ message: getErrorMessage(e) });
//   }
// }
