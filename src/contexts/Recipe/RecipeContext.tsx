import { createContext } from "react";
import { Label, MealType, Menu, Recipe } from "../../types/recipeType";

export type RecipeTypeContext = {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  currentMenu: Menu;
  setCurrentMenu: (menu: Menu) => void;
  menuCreated: boolean;
  setMenuCreated: (created: boolean) => void;
  mealTypes: MealType[];
  setMealTypes: (mealTypes: MealType[]) => void;
  labels: Label[];
  setLabels: (labels: Label[]) => void;
};

export const RecipeContext = createContext({} as RecipeTypeContext);
