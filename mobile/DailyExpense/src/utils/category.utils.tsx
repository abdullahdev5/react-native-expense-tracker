import { CategoryColor, CategoryIcon } from "../types/category";

export const CATEGORY_ICON_MAP2 = new Map<CategoryIcon, string | null>([
  ['food', 'food'],

])

export const CATEGORY_ICON_MAP: Record<Exclude<CategoryIcon, null>, string> = {
  food: "food",
  groceries: "basket",
  dining: "silverware-fork-knife",
  coffee: "coffee",

  transport: "car",
  fuel: "fuel",
  taxi: "taxi",
  public_transport: "bus",

  shopping: "cart",
  clothing: "tshirt-crew",
  electronics: "cellphone",
  online_shopping: "shopping",

  bills: "receipt",
  electricity: "flash",
  water: "water",
  internet: "wifi",
  rent: "home",

  entertainment: "movie",
  movies: "movie-open",
  games: "gamepad-variant",
  music: "music",
  streaming: "television",

  health: "medical-bag",
  medical: "hospital-box",
  pharmacy: "pill",
  fitness: "dumbbell",

  education: "school",
  books: "book",
  courses: "book-open-page-variant",

  travel: "airplane",
  hotel: "bed",
  flights: "airplane-takeoff",
  vacation: "beach",

  salary: "cash",
  freelance: "laptop",
  business: "briefcase",
  gift: "gift",
  bonus: "wallet",

  other: "shape",
  none: 'close-circle-outline'
}

export const CATEGORY_COLOR_MAP: Record<CategoryColor, string> = {
  red: "#EF4444",
  green: "#22C55E",
  blue: "#3B82F6",
  orange: "#F97316",
  purple: "#A855F7",
  pink: "#EC4899",
  yellow: "#EAB308",
  gray: "#6B7280",
  teal: "#14B8A6",
};


export const getCategoryIcon = (iconKey: CategoryIcon): string => {
    return iconKey
    ? CATEGORY_ICON_MAP[iconKey] || CATEGORY_ICON_MAP.other
    : CATEGORY_ICON_MAP.other;
}

export const getCategoryColor = (colorKey: CategoryColor) => {
    return colorKey
    ? CATEGORY_COLOR_MAP[colorKey] || CATEGORY_COLOR_MAP.yellow
    : CATEGORY_COLOR_MAP.yellow;
}