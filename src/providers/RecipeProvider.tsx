import React, { useState } from "react";
import { RecipeContext, RecipeTypeContext } from "../contexts/RecipeContext";
import { Menu, Recipe } from "../types/RecipeType";
import { initDB } from "../services/database.service";

type RecipeProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

function RecipeProvider(props: RecipeProviderProps) {
  initDB();

  const { children } = props;

  let recipeDefault: Recipe = {
    id: undefined,
    name: "",
    description: "",
    label: "" as "hidratos" | "fibra" | "proteína" | "pescado",
    ingredients: "",
    steps: "",
    weekDay: "",
  };

  let menuDefault: Menu = {
    id: 0,
    created: "",
    recipes: [],
  };

  const [recipe, setRecipe] = useState(recipeDefault);
  const [todaysRecipe, setTodaysRecipe] = useState(recipeDefault);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentMenu, setCurrentMenu] = useState<Menu>(menuDefault);
  const [menuCreated, setMenuCreated] = useState<boolean>(false);

  const defaultValue: RecipeTypeContext = {
    recipe,
    setRecipe,
    todaysRecipe,
    setTodaysRecipe,
    recipes,
    setRecipes,
    currentMenu,
    setCurrentMenu,
    menuCreated,
    setMenuCreated,
  };

  return (
    <RecipeContext.Provider value={defaultValue}>
      {children}
    </RecipeContext.Provider>
  );
}

export default RecipeProvider;
