import { createContext } from "react";
import { Label, MealType, Menu, Recipe } from "../types/RecipeType";

export type RecipeTypeContext = {
  recipe: Recipe;
  setRecipe: Function;
  recipes: Recipe[];
  setRecipes: Function;
  currentMenu: Menu;
  setCurrentMenu: Function;
  menuCreated: boolean;
  setMenuCreated: Function;
  mealTypes: MealType[];
  setMealTypes: Function;
  labels: Label[];
  setLabels: Function;
};

export const RecipeContext = createContext({} as RecipeTypeContext);
