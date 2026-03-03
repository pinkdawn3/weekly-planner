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
  description: string;
  ingredients: string[];
  steps: string[];
  mealTypes: MealType[];
  labels: Label[];
};

export type MenuRecipe = {
  recipe: Recipe;
  mealType: MealType;
  weekDay: string;
};

export type Menu = {
  id: number;
  created: string;
  recipes: MenuRecipe[];
};

export type Preferences = {
  [labelId: number]: number;
};
