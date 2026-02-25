import * as SQLite from "expo-sqlite";
import { Menu, Recipe } from "../types/RecipeType";

const db = SQLite.openDatabaseSync("weeklymeal.db");

// Inicializa las tablas si no existen
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      label TEXT,
      ingredients TEXT,
      steps TEXT,
      weekDay TEXT
    );
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS menu_recipes (
      menu_id INTEGER,
      recipe_id INTEGER,
      FOREIGN KEY (menu_id) REFERENCES menus(id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );
  `);
};

// Recipes
export const getAllRecipes = (): Recipe[] => {
  return db.getAllSync("SELECT * FROM recipes");
};

export const createRecipe = (recipe: Recipe): void => {
  db.runSync(
    "INSERT INTO recipes (name, description, label, ingredients, steps, weekDay) VALUES (?, ?, ?, ?, ?, ?)",
    [
      recipe.name,
      recipe.description,
      recipe.label,
      recipe.ingredients,
      recipe.steps,
      recipe.weekDay,
    ],
  );
};

export const updateRecipe = (recipe: Recipe): void => {
  if (!recipe.id) return;

  db.runSync(
    "UPDATE recipes SET name=?, description=?, label=?, ingredients=?, steps=?, weekDay=? WHERE id=?",
    [
      recipe.name,
      recipe.description,
      recipe.label,
      recipe.ingredients,
      recipe.steps,
      recipe.weekDay,
      recipe.id,
    ],
  );
};

export const deleteRecipe = (recipeId: number): void => {
  db.runSync("DELETE FROM recipes WHERE id=?", [recipeId]);
};

// Menus
export const getLastMenu = (): Menu | null => {
  const menu = db.getFirstSync<{ id: number; created: string }>(
    "SELECT * FROM menus ORDER BY id DESC LIMIT 1",
  );
  if (!menu) return null;

  const recipes = db.getAllSync<Recipe>(
    "SELECT r.* FROM recipes r JOIN menu_recipes mr ON r.id = mr.recipe_id WHERE mr.menu_id = ?",
    [menu.id],
  );
  return { ...menu, recipes };
};

export const createMenu = (recipes: Recipe[]): void => {
  const created = new Date().toISOString();
  db.runSync("INSERT INTO menus (created) VALUES (?)", [created]);

  const menu = db.getFirstSync<{ id: number }>(
    "SELECT id FROM menus ORDER BY id DESC LIMIT 1",
  );
  if (!menu) return;

  recipes.forEach((recipe) => {
    if (!recipe.id) return;

    db.runSync("INSERT INTO menu_recipes (menu_id, recipe_id) VALUES (?, ?)", [
      menu.id,
      recipe.id,
    ]);
  });
};

export default db;
