import { create } from 'zustand';
import { ApiResponse } from '../types/api';
import { Category } from '../types/category';
import { getAllCategoriesService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { observeCategoriesFromLocalDB } from '../db/operations/categoryOps';

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  subscribeToCategories: () => Subscription;
  fetchCategories: () => Promise<void>;
  addCategoryIfNotExists: (newCategory: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Helper Selectors
  getIncomeCategories: () => Category[];
  getExpenseCategories: () => Category[];
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  isSubscribed: false,
  subscribeToCategories: (): Subscription => {
    const subsription = observeCategoriesFromLocalDB().subscribe({
        next: (categories) => {
          console.log(`Categories from Local DB: ${JSON.stringify(categories)}`);

            set({ categories });
        },
        error: (e: any) => {
            set({ error: e.message });
            console.error('Categories stream error:', e.message)
        }
    });
    set({ isSubscribed: true });

    return subsription;
  },
  fetchCategories: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      const categories = await getAllCategoriesService();

      set({
        isLoading: false,
        categories,
      });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e.message,
      });
    }
  },
  // fetchCategories: async (): Promise<void> => {
  //     set({ isLoading: true });

  //     const res = await getAllCategoriesService();

  //     if (res.success && res.data) {
  //         const categories = res.data;

  //         set({
  //             isLoading: false,
  //             categories,
  //         });
  //     } else {
  //         set({
  //             isLoading: false,
  //             error: res.message
  //         });
  //     }
  // },
  addCategoryIfNotExists: (newCategory: Category) => {
    set(state => {
      const categoryExists = state.categories.find(
        cat => cat.id === newCategory.id,
      );

      if (categoryExists) {
        return {
          categories: state.categories,
        };
      }

      const updatedCategories = [newCategory, ...state.categories];

      return {
        categories: updatedCategories,
      };
    });
  },
  deleteCategory: (id: string) => {
    set(state => ({
      categories: state.categories.filter(c => c.id !== id),
    }));
  },

  getIncomeCategories: () => {
    return get().categories.filter(cat => cat.type === 'income');
  },
  getExpenseCategories: () => {
    return get().categories.filter(cat => cat.type === 'expense');
  },
}));
