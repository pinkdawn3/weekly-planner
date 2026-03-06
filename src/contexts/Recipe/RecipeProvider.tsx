import React, { useState } from "react";
import {
  initDB,
  getAllRecipes,
  getAllMealTypes,
  getAllLabels,
  getLastMenu,
} from "../../services/db/database.service";
import { RecipeTypeContext, RecipeContext } from "./RecipeContext";
import { Recipe, Menu, MealType, Label } from "../../types/recipeType";

type RecipeProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

function RecipeProvider(props: RecipeProviderProps) {
  initDB();
  const { children } = props;

  const recipeDefault: Recipe = {
    id: undefined,
    name: "",
    description: "",
    ingredients: [],
    steps: [],
    mealTypes: [],
    labels: [],
  };

  const menuDefault: Menu = {
    id: 0,
    created: "",
    recipes: [],
  };

  const [recipe, setRecipe] = useState<Recipe>(recipeDefault);
  const [recipes, setRecipes] = useState<Recipe[]>(getAllRecipes());
  const [currentMenu, setCurrentMenu] = useState<Menu>(() => {
    const lastMenu = getLastMenu();
    return lastMenu ?? menuDefault;
  });
  const [menuCreated, setMenuCreated] = useState<boolean>(false);
  const [mealTypes, setMealTypes] = useState<MealType[]>(getAllMealTypes());
  const [labels, setLabels] = useState<Label[]>(getAllLabels());

  const defaultValue: RecipeTypeContext = {
    recipe,
    setRecipe,
    recipes,
    setRecipes,
    currentMenu,
    setCurrentMenu,
    menuCreated,
    setMenuCreated,
    mealTypes,
    setMealTypes,
    labels,
    setLabels,
  };

  return (
    <RecipeContext.Provider value={defaultValue}>
      {children}
    </RecipeContext.Provider>
  );
}

export default RecipeProvider;
