import { createContext } from "react";
import { Menu, Recipe } from "../types/RecipeType";

export type RecipeTypeContext = {
  todaysRecipe: Recipe;
  setTodaysRecipe: Function;
  recipe: Recipe;
  setRecipe: Function;
  recipes: Recipe[];
  setRecipes: Function;
  currentMenu: Menu;
  setCurrentMenu: Function;
  menuCreated: boolean;
  setMenuCreated: Function;
};

export const RecipeContext = createContext({} as RecipeTypeContext);
