import { NextFunction, Request, Response } from "express";
import { CreateCategoryRequestPayload, CreateCategoryRequestDTO, UpdateCategoryRequestDTO, UpdateCategoryPayload } from "../types/category";
import { responseHelper } from "../helpers/responseHelper";
import { HttpError } from "../utils/errors.util";
import { categoryService } from "../services/category.service";
import { TransactionType } from "../types/transaction";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!._id;
    const reqBody: CreateCategoryRequestDTO = req.body;

    if (!reqBody.name || !reqBody.type || !reqBody.icon || !reqBody.color) {
      throw new HttpError("all fields required!", 400);
    }

    const bodyData: CreateCategoryRequestPayload = {
      name: reqBody.name,
      type: reqBody.type as TransactionType,
      icon: reqBody.icon,
      color: reqBody.color
    }

    const category = await categoryService.addCategory(
      userId.toString(),
      bodyData,
    );

    // sending response
    return responseHelper.sendSuccess(
      res,
      category,
      "category created successfully",
      201,
    );
  } catch (e: any) {
    next(e);
  }
};

// Delete Category
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!._id;
    const categoryId = req.params.id;

    const deletedCategory = await categoryService.deleteCategory(userId.toString(), categoryId as string);
    
    // sending response
    return responseHelper.sendSuccess(res, deletedCategory, "Category deleted successfully");
  } catch (e: any) {
    next(e);
  }
};

// Get All Categories
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const categories = await categoryService.getAllCategories(userId.toString());

    return responseHelper.sendSuccess(
      res,
      categories,
      'Categories fetched Successfully'
    );
  } catch (e) {
    next(e);
  }
}

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const categoryId = req.params.id;
    const { name, icon, color }: UpdateCategoryRequestDTO = req.body;

    let bodyData: UpdateCategoryPayload = {
      categoryId: categoryId as string
    };

    if (name && !name.trim()) {
      bodyData.name = name;
    }
    if (icon !== undefined) {
      bodyData.icon = icon;
    }
    if (color) {
      bodyData.color = color;
    }

    const category = await categoryService.updateCategory(userId.toString(), bodyData);

    // sending response
    return responseHelper.sendSuccess(
      res,
      category,
      "Category Updated Successfully",
    )
  } catch(e) {
    next(e);
  }
}

export { createCategory, deleteCategory, getAllCategories, updateCategory };