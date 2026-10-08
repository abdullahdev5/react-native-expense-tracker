import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { ICategory } from '../types/category';
import { DATABASE_NAME } from '../constants/dbConstants';
dotenv.config();

const defaultCategories = [
  // --- EXPENSES ---
  {
    name: 'Food & Dining',
    type: 'expense',
    icon: 'food',
    color: 'orange',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Transportation',
    type: 'expense',
    icon: 'transport',
    color: 'blue',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Shopping',
    type: 'expense',
    icon: 'shopping',
    color: 'pink',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Housing & Rent',
    type: 'expense',
    icon: 'rent',
    color: 'red',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Entertainment',
    type: 'expense',
    icon: 'entertainment',
    color: 'purple',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Medical & Health',
    type: 'expense',
    icon: 'health',
    color: 'teal',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Education',
    type: 'expense',
    icon: 'education',
    color: 'yellow',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Bills & Utilities',
    type: 'expense',
    icon: 'bills',
    color: 'gray',
    userId: null,
    isDeleted: false
  },

  // --- INCOME ---
  {
    name: 'Salary',
    type: 'income',
    icon: 'salary',
    color: 'green',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Freelance',
    type: 'income',
    icon: 'freelance',
    color: 'blue',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Business',
    type: 'income',
    icon: 'business',
    color: 'teal',
    userId: null,
    isDeleted: false
  },
  {
    name: 'Gifts',
    type: 'income',
    icon: 'gift',
    color: 'pink',
    userId: null,
    isDeleted: false
  }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI!, { dbName: DATABASE_NAME });
        console.log('Connected to MongoDB for seeding...');

        const existingDefaultCategoriesCount = await Category.countDocuments({ userId: null });

        if (existingDefaultCategoriesCount === 0) {
            console.log('No default categories found. Seeding...');
            await Category.insertMany(defaultCategories);
            console.log('Successfully saved default categories!');
        } else {
            console.log("System categories already exists. Skipping.");
        }
    } catch (e) {
        console.error('Error seeding database:', e);
        process.exit(1);
    } finally {
        // Close Connection so script finishes
        await mongoose.disconnect();
    }
}

seedDatabase();