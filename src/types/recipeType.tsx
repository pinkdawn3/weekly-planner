export type MealType = {
  id: number;
  name: string;
};

export type Label = {
  id: number;
  name: string;
};

export type Recipe = {
  id: number | undefined;
  name: string;
  description?: string | null;
  ingredients: string[];
  steps: string[];
  mealTypes: MealType[];
  labels: Label[];
  photo_uri?: string;
};

export type MenuRecipe = {
  recipe: Recipe;
  mealType: MealType;
  weekDay: string;
};

export type MenuSlot = {
  weekDay: string;
  mealTypeId: number;
  mealTypeName: string;
};

export type Menu = {
  id: number;
  created: string;
  recipes: MenuRecipe[];
  structure: MenuSlot[];
};

export type Preferences = {
  [labelId: number]: number;
};
