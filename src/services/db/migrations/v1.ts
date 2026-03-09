import db from "../client";

export const v1 = () => {
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
      photo_uri TEXT
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

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Default values
  const mealTypeCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM meal_types",
  );
  if (mealTypeCount?.count === 0) {
    db.execSync(`
      INSERT INTO meal_types (name) VALUES ('Lunch');
      INSERT INTO meal_types (name) VALUES ('Dinner');
    `);
  }

  const labelCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM labels",
  );
  if (labelCount?.count === 0) {
    db.execSync(`
      INSERT INTO labels (name) VALUES ('Protein');
      INSERT INTO labels (name) VALUES ('Carbs');
      INSERT INTO labels (name) VALUES ('Fibre');
      INSERT INTO labels (name) VALUES ('Fish');
    `);
  }
};
