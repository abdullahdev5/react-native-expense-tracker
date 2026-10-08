import { DropdownItem } from '@components/Dropdown';
import { Category, CategoryColor, CategoryIcon } from '../types/category';
import { getCategoryColor } from '../utils/category.utils';
import { mapCategory } from '../utils/mapper';

export const categoryIconsDropdownData: DropdownItem<CategoryIcon>[] = [
  { label: 'Category Icon (Optional)', value: null, data: null },

  // 🍔 Food & Drinks
  { label: 'Food', value: 'food', icon: 'food', data: 'food' },
  {
    label: 'Groceries',
    value: 'groceries',
    icon: 'groceries',
    data: 'groceries',
  },
  { label: 'Dining', value: 'dining', icon: 'dining', data: 'dining' },
  { label: 'Coffee', value: 'coffee', icon: 'coffee', data: 'coffee' },

  // 🚗 Transport
  {
    label: 'Transport',
    value: 'transport',
    icon: 'transport',
    data: 'transport',
  },
  { label: 'Fuel', value: 'fuel', icon: 'fuel', data: 'fuel' },
  { label: 'Taxi', value: 'taxi', icon: 'taxi', data: 'taxi' },
  {
    label: 'Public Transport',
    value: 'public_transport',
    icon: 'public_transport',
    data: 'public_transport',
  },

  // 🛍 Shopping
  { label: 'Shopping', value: 'shopping', icon: 'shopping', data: 'shopping' },
  { label: 'Clothing', value: 'clothing', icon: 'clothing', data: 'clothing' },
  {
    label: 'Electronics',
    value: 'electronics',
    icon: 'electronics',
    data: 'electronics',
  },
  {
    label: 'Online Shopping',
    value: 'online_shopping',
    icon: 'online_shopping',
    data: 'online_shopping',
  },

  // 🧾 Bills
  { label: 'Bills', value: 'bills', icon: 'bills', data: 'bills' },
  {
    label: 'Electricity',
    value: 'electricity',
    icon: 'electricity',
    data: 'electricity',
  },
  { label: 'Water', value: 'water', icon: 'water', data: 'water' },
  { label: 'Internet', value: 'internet', icon: 'internet', data: 'internet' },
  { label: 'Rent', value: 'rent', icon: 'rent', data: 'rent' },

  // 🎬 Entertainment
  {
    label: 'Entertainment',
    value: 'entertainment',
    icon: 'entertainment',
    data: 'entertainment',
  },
  { label: 'Movies', value: 'movies', icon: 'movies', data: 'movies' },
  { label: 'Games', value: 'games', icon: 'games', data: 'games' },
  { label: 'Music', value: 'music', icon: 'music', data: 'music' },
  {
    label: 'Streaming',
    value: 'streaming',
    icon: 'streaming',
    data: 'streaming',
  },

  // 🏥 Health
  { label: 'Health', value: 'health', icon: 'health', data: 'health' },
  { label: 'Medical', value: 'medical', icon: 'medical', data: 'medical' },
  { label: 'Pharmacy', value: 'pharmacy', icon: 'pharmacy', data: 'pharmacy' },
  { label: 'Fitness', value: 'fitness', icon: 'fitness', data: 'fitness' },

  // 🎓 Education
  {
    label: 'Education',
    value: 'education',
    icon: 'education',
    data: 'education',
  },
  { label: 'Books', value: 'books', icon: 'books', data: 'books' },
  { label: 'Courses', value: 'courses', icon: 'courses', data: 'courses' },

  // ✈️ Travel
  { label: 'Travel', value: 'travel', icon: 'travel', data: 'travel' },
  { label: 'Hotel', value: 'hotel', icon: 'hotel', data: 'hotel' },
  { label: 'Flights', value: 'flights', icon: 'flights', data: 'flights' },
  { label: 'Vacation', value: 'vacation', icon: 'vacation', data: 'vacation' },

  // 💰 Income
  { label: 'Salary', value: 'salary', icon: 'salary', data: 'salary' },
  {
    label: 'Freelance',
    value: 'freelance',
    icon: 'freelance',
    data: 'freelance',
  },
  { label: 'Business', value: 'business', icon: 'business', data: 'business' },
  { label: 'Gift', value: 'gift', icon: 'gift', data: 'gift' },
  { label: 'Bonus', value: 'bonus', icon: 'bonus', data: 'bonus' },

  // 🧩 Other
  { label: 'Other', value: 'other', icon: 'other', data: 'other' },
];

export const categoryColorsDropdownData: DropdownItem<CategoryColor>[] = [
  { label: 'Blue', value: 'blue', icon: 'blue', data: 'blue' },
  { label: 'Red', value: 'red', icon: 'red', data: 'red' },
  { label: 'Green', value: 'green', icon: 'green', data: 'green' },
  { label: 'Orange', value: 'orange', icon: 'orange', data: 'orange' },
  { label: 'Purple', value: 'purple', icon: 'purple', data: 'purple' },
  { label: 'Pink', value: 'pink', icon: 'pink', data: 'pink' },
  { label: 'Yellow', value: 'yellow', icon: 'yellow', data: 'yellow' },
  { label: 'Gray', value: 'gray', icon: 'gray', data: 'gray' },
  { label: 'Teal', value: 'teal', icon: 'teal', data: 'teal' },
];


/* Fake Categories Data */
export const fakeCategoriesData: Category[] = [
  mapCategory({
    id: '1',
    name: 'Groceries',
    color: 'teal' as CategoryColor,
    icon: 'groceries' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '2',
    name: 'Electronics',
    color: 'orange' as CategoryColor,
    icon: 'electronics' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '3',
    name: 'Transport',
    color: 'blue' as CategoryColor,
    icon: 'transport' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '4',
    name: 'Dining Out',
    color: 'red' as CategoryColor,
    icon: 'dining' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '5',
    name: 'Health Checkup',
    color: 'green' as CategoryColor,
    icon: 'health' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '6',
    name: 'Movie Night',
    color: 'purple' as CategoryColor,
    icon: 'movies' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '7',
    name: 'Monthly Rent',
    color: 'gray' as CategoryColor,
    icon: 'rent' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '8',
    name: 'Gym Membership',
    color: 'pink' as CategoryColor,
    icon: 'fitness' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '9',
    name: 'Salary',
    color: 'green' as CategoryColor,
    icon: 'salary' as CategoryIcon, // Matches your dropdown value
  }),
  mapCategory({
    id: '10',
    name: 'Coffee Shop',
    color: 'orange' as CategoryColor,
    icon: 'coffee' as CategoryIcon, // Matches your dropdown value
  }),
];