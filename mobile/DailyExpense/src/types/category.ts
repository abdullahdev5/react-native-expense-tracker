/* Models */
export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: CategoryIcon | null;
    color: CategoryColor;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/* DTO's */
export interface CategoryDTO {
    id?: string;
    name?: string;
    type?: 'income' | 'expense';
    icon?: string | null;
    color?: string;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/* Types */
export type CreateCategoryPayload = {
    name: string;
    type: string;
    icon?: CategoryIcon | null;
    color: string;
};

export type CategoryIcon =
  | "food"
  | "groceries"
  | "dining"
  | "coffee"
  | "transport"
  | "fuel"
  | "taxi"
  | "public_transport"
  | "shopping"
  | "clothing"
  | "electronics"
  | "online_shopping"
  | "bills"
  | "electricity"
  | "water"
  | "internet"
  | "rent"
  | "entertainment"
  | "movies"
  | "games"
  | "music"
  | "streaming"
  | "health"
  | "medical"
  | "pharmacy"
  | "fitness"
  | "education"
  | "books"
  | "courses"
  | "travel"
  | "hotel"
  | "flights"
  | "vacation"
  | "salary"
  | "freelance"
  | "business"
  | "gift"
  | "bonus"
  | "other"
  | "none"
  | null;

export type CategoryColor =
  | "blue"
  | "red"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "yellow"
  | "gray"
  | "teal";