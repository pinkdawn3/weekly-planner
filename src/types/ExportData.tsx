import { MealType, Label, Recipe } from "./recipeType";

export type ExportData = {
  version: number;
  exportedAt: string;
  mealTypes: MealType[];
  labels: Label[];
  recipes: Recipe[];
};
