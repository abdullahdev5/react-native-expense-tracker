import { apiClient } from "../config/axios";
import { REQUEST_URL_CONSTANTS } from "../constants/apiConstants";
import { ApiResponse } from "../types/api";
import { CategoryDTO, CreateCategoryPayload } from "../types/category";


export const addCategoryApi = async (data: CreateCategoryPayload) => {
    const res = await apiClient.post<ApiResponse<CategoryDTO>>
        (REQUEST_URL_CONSTANTS.createCategory, data);

    return res.data;
};

export const getAllCategoriesApi = async () => {
    const url = REQUEST_URL_CONSTANTS.getCategories;

    const res = await apiClient.get<ApiResponse<CategoryDTO[]>>(url.toString());

    return res.data;
};

export const deleteCategoryApi = async (id: string) => {
    const url = `${REQUEST_URL_CONSTANTS.deleteCategory}/${id}`;

    const res = await apiClient.delete<ApiResponse<CategoryDTO>>(url);

    return res.data;
}