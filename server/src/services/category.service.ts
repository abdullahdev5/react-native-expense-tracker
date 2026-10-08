import { QueryFilter, Types } from "mongoose";
import { supabaseAdmin } from "../config/supabase";
import { BUCKET_NAMES } from "../constants/supabaseConstants";
import { Category } from "../models/Category";
import { CreateCategoryRequestPayload, ICategory, UpdateCategoryPayload } from "../types/category";
import { HttpError } from "../utils/errors.util";
import { socketService } from "./socket.service";

class CategoryService {

  public async addCategory(
    userId: string,
    data: CreateCategoryRequestPayload,
  ) {

    // Category Name
    const normalizedCategoryName: string = data.name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      name: normalizedCategoryName,
      userId: userId,
      isDeleted: false,
      $or: [
        { userId: new Types.ObjectId(userId) },
        { userId: null }
      ]
    });

    if (existingCategory) {
      throw new HttpError("This Category is already exists!", 409);
    }

    // Adding Category
    const category = await Category.create({
      userId: new Types.ObjectId(userId),
      name: normalizedCategoryName,
      type: data.type,
      icon: data.icon ?? null,
      color: data.color,
    });

    console.log(`New Category: ${JSON.stringify(category)}`);

    // Emit New Category to User
    socketService.emitToUser(userId, 'new_category', category.toObject());

    return category;
  }

  public async deleteCategory(userId: string, categoryId: string) {
    const category = await Category.findOne({
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(categoryId)
    });

    if (!category) {
      throw new HttpError(
        'faield to find teh Category to delete!',
        400
      );
    }

    category.isDeleted = true;

    await category.save();

    return category;
  }

  public async getAllCategories(userId: string) {
    const categories = await Category.find({
      isDeleted: false,
      $or: [
        { userId },
        { userId: null }
      ]
    })
    .sort({ userId: 1, createdAt: -1 });

    return categories;
  }

  public async updateCategory(userId: string, data: UpdateCategoryPayload) {
    const { categoryId, name, icon, color } = data;

    const category = await Category.findOne({
      userId: new Types.ObjectId(userId),
      id: new Types.ObjectId(categoryId)
    });

    if (!category) {
      throw new HttpError('Category not found to update!', 400);
    }

    if (category.userId == null) {
      throw new HttpError('Default Categories cannot be updated!', 409);
    }

    if (name) {
      const normalizedName = name.trim().toLowerCase();

      const existingCategory = await Category.findOne({
        name: normalizedName,
        isDeleted: false,
        $or: [
          { userId },
          { userId: null }
        ],
        _id: { $ne: categoryId }
      });

      if (existingCategory) {
        throw new HttpError('This Category is already exists!', 409);
      }

      category.name = normalizedName;
    }

    if (icon !== undefined) {
      category.icon = icon;
    }

    if (color) {
      category.color = color;
    }

    // Save Category
    await category.save();

    return category;
  }

  
}


export const categoryService = new CategoryService();