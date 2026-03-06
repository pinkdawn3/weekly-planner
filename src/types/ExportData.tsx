import { MealType, Label, Recipe } from "./RecipeType";

export type ExportData = {
  version: number;
  exportedAt: string;
  mealTypes: MealType[];
  labels: Label[];
  recipes: Recipe[];
};
