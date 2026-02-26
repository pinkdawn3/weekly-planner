import * as SQLite from "expo-sqlite";
import { Label, MealType, Menu, MenuRecipe, Recipe } from "../types/RecipeType";

const db = SQLite.openDatabaseSync("weeklymeal.db");

export const initDB = () => {
  // Creación de tablas:
  // - Meal Types (desayuno, almuerzo, cena...)
  // - Labels (hidratos, proteina, pescado...)
  // - Recipes (todas las recetas)
  // - Relación recetas/meal_type (muchos a muchos)
  // - Relación recetas/label (muchos a muchos)
  // - Menú (guardamos 2, el último y el de la semana anterior)
  // - Relación menú/recetas

  db.execSync(`
    CREATE TABLE IF NOT EXISTS meal_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS labels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      ingredients TEXT,
      steps TEXT
    );
    CREATE TABLE IF NOT EXISTS recipe_meal_types (
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      meal_type_id INTEGER REFERENCES meal_types(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS recipe_labels (
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS menu_recipes (
      menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      meal_type_id INTEGER REFERENCES meal_types(id),
      week_day TEXT
    );
  `);

  // Valores por defecto si las tablas están vacías
  const mealTypeCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM meal_types",
  );
  if (mealTypeCount?.count === 0) {
    db.execSync(`
      INSERT INTO meal_types (name) VALUES ('Almuerzo');
      INSERT INTO meal_types (name) VALUES ('Cena');
    `);
  }

  const labelCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM labels",
  );
  if (labelCount?.count === 0) {
    db.execSync(`
      INSERT INTO labels (name) VALUES ('Proteína');
      INSERT INTO labels (name) VALUES ('Hidratos');
      INSERT INTO labels (name) VALUES ('Fibra');
      INSERT INTO labels (name) VALUES ('Pescado');
    `);
  }
};

// MealTypes
export const getAllMealTypes = (): MealType[] => {
  return db.getAllSync<MealType>("SELECT * FROM meal_types");
};

export const createMealType = (name: string): void => {
  db.runSync("INSERT INTO meal_types (name) VALUES (?)", [name]);
};

export const deleteMealType = (id: number): void => {
  db.runSync("DELETE FROM meal_types WHERE id=?", [id]);
};

// Labels
export const getAllLabels = (): Label[] => {
  return db.getAllSync<Label>("SELECT * FROM labels");
};

export const createLabel = (name: string): void => {
  db.runSync("INSERT INTO labels (name) VALUES (?)", [name]);
};

export const deleteLabel = (id: number): void => {
  db.runSync("DELETE FROM labels WHERE id=?", [id]);
};

//  Recipes
export const getAllRecipes = (): Recipe[] => {
  const recipes = db.getAllSync<Omit<Recipe, "mealTypes" | "labels">>(
    "SELECT * FROM recipes",
  );

  return recipes.map((recipe) => {
    const mealTypes = db.getAllSync<MealType>(
      `SELECT mt.* FROM meal_types mt
       JOIN recipe_meal_types rmt ON mt.id = rmt.meal_type_id
       WHERE rmt.recipe_id = ?`,
      [recipe.id!],
    );
    const labels = db.getAllSync<Label>(
      `SELECT l.* FROM labels l
       JOIN recipe_labels rl ON l.id = rl.label_id
       WHERE rl.recipe_id = ?`,
      [recipe.id!],
    );
    return { ...recipe, mealTypes, labels };
  });
};

export const createRecipe = (recipe: Recipe): void => {
  db.runSync(
    "INSERT INTO recipes (name, description, ingredients, steps) VALUES (?, ?, ?, ?)",
    [recipe.name, recipe.description, recipe.ingredients, recipe.steps],
  );

  const newRecipe = db.getFirstSync<{ id: number }>(
    "SELECT id FROM recipes ORDER BY id DESC LIMIT 1",
  );
  if (!newRecipe) return;

  recipe.mealTypes.forEach((mt) => {
    db.runSync(
      "INSERT INTO recipe_meal_types (recipe_id, meal_type_id) VALUES (?, ?)",
      [newRecipe.id, mt.id],
    );
  });

  recipe.labels.forEach((label) => {
    db.runSync(
      "INSERT INTO recipe_labels (recipe_id, label_id) VALUES (?, ?)",
      [newRecipe.id, label.id],
    );
  });
};

export const updateRecipe = (recipe: Recipe): void => {
  if (!recipe.id) return;

  db.runSync(
    "UPDATE recipes SET name=?, description=?, ingredients=?, steps=? WHERE id=?",
    [
      recipe.name,
      recipe.description,
      recipe.ingredients,
      recipe.steps,
      recipe.id,
    ],
  );

  // Borramos las relaciones anteriores y las recreamos
  db.runSync("DELETE FROM recipe_meal_types WHERE recipe_id=?", [recipe.id]);
  db.runSync("DELETE FROM recipe_labels WHERE recipe_id=?", [recipe.id]);

  recipe.mealTypes.forEach((mt) => {
    db.runSync(
      "INSERT INTO recipe_meal_types (recipe_id, meal_type_id) VALUES (?, ?)",
      [recipe.id!, mt.id],
    );
  });

  recipe.labels.forEach((label) => {
    db.runSync(
      "INSERT INTO recipe_labels (recipe_id, label_id) VALUES (?, ?)",
      [recipe.id!, label.id],
    );
  });
};

export const deleteRecipe = (recipeId: number | undefined): void => {
  if (!recipeId) return;
  db.runSync("DELETE FROM recipes WHERE id=?", [recipeId]);
};

// Menus
export const getLastMenu = (): Menu | null => {
  const menu = db.getFirstSync<{ id: number; created: string }>(
    "SELECT * FROM menus ORDER BY id DESC LIMIT 1",
  );
  if (!menu) return null;

  const menuRecipes = db.getAllSync<{
    recipe_id: number;
    meal_type_id: number;
    week_day: string;
  }>(
    "SELECT recipe_id, meal_type_id, week_day FROM menu_recipes WHERE menu_id=?",
    [menu.id],
  );

  const recipes: MenuRecipe[] = menuRecipes.map((mr) => {
    const recipe = db.getFirstSync<Omit<Recipe, "mealTypes" | "labels">>(
      "SELECT * FROM recipes WHERE id=?",
      [mr.recipe_id],
    )!;

    const mealTypes = db.getAllSync<MealType>(
      `SELECT mt.* FROM meal_types mt
       JOIN recipe_meal_types rmt ON mt.id = rmt.meal_type_id
       WHERE rmt.recipe_id = ?`,
      [mr.recipe_id],
    );

    const labels = db.getAllSync<Label>(
      `SELECT l.* FROM labels l
       JOIN recipe_labels rl ON l.id = rl.label_id
       WHERE rl.recipe_id = ?`,
      [mr.recipe_id],
    );

    const mealType = db.getFirstSync<MealType>(
      "SELECT * FROM meal_types WHERE id=?",
      [mr.meal_type_id],
    )!;

    return {
      recipe: { ...recipe, mealTypes, labels },
      mealType,
      weekDay: mr.week_day,
    };
  });

  return { ...menu, recipes };
};

export const getLastMenus = (count: number): Menu[] => {
  const menus = db.getAllSync<{ id: number; created: string }>(
    "SELECT * FROM menus ORDER BY id DESC LIMIT ?",
    [count],
  );

  return menus.map((menu) => {
    const menuRecipes = db.getAllSync<{
      recipe_id: number;
      meal_type_id: number;
      week_day: string;
    }>(
      "SELECT recipe_id, meal_type_id, week_day FROM menu_recipes WHERE menu_id=?",
      [menu.id],
    );

    const recipes: MenuRecipe[] = menuRecipes.map((mr) => {
      const recipe = db.getFirstSync<Omit<Recipe, "mealTypes" | "labels">>(
        "SELECT * FROM recipes WHERE id=?",
        [mr.recipe_id],
      )!;

      const mealTypes = db.getAllSync<MealType>(
        `SELECT mt.* FROM meal_types mt
         JOIN recipe_meal_types rmt ON mt.id = rmt.meal_type_id
         WHERE rmt.recipe_id = ?`,
        [mr.recipe_id],
      );

      const labels = db.getAllSync<Label>(
        `SELECT l.* FROM labels l
         JOIN recipe_labels rl ON l.id = rl.label_id
         WHERE rl.recipe_id = ?`,
        [mr.recipe_id],
      );

      const mealType = db.getFirstSync<MealType>(
        "SELECT * FROM meal_types WHERE id=?",
        [mr.meal_type_id],
      )!;

      return {
        recipe: { ...recipe, mealTypes, labels },
        mealType,
        weekDay: mr.week_day,
      };
    });

    return { ...menu, recipes };
  });
};

export const createMenu = (menuRecipes: MenuRecipe[]): void => {
  const created = new Date().toISOString();
  db.runSync("INSERT INTO menus (created) VALUES (?)", [created]);

  const menu = db.getFirstSync<{ id: number }>(
    "SELECT id FROM menus ORDER BY id DESC LIMIT 1",
  );
  if (!menu) return;

  menuRecipes.forEach((mr) => {
    db.runSync(
      "INSERT INTO menu_recipes (menu_id, recipe_id, meal_type_id, week_day) VALUES (?, ?, ?, ?)",
      [menu.id, mr.recipe.id!, mr.mealType.id, mr.weekDay],
    );
  });
};

export default db;
