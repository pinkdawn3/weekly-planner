// __tests__/database.service.test.ts
import { mockDb } from "../__mocks__/expo-sqlite";
import {
  createLabel,
  createMealType,
  createRecipe,
  deleteLabel,
  deleteMealType,
  deleteRecipe,
  getAllLabels,
  getAllMealTypes,
  getAllRecipes,
  getPreference,
  setPreference,
  updateRecipe,
} from "../src/services/db/database.service";

describe("Recipe CRUD", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a recipe", () => {
    const recipe = {
      id: undefined,
      name: "Paella",
      description: null,
      ingredients: ["arroz", "pollo"],
      steps: ["cocinar"],
      mealTypes: [{ id: 1, name: "Almuerzo" }],
      labels: [],
    };

    createRecipe(recipe);

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO recipes"),
      expect.arrayContaining(["Paella"]),
    );
  });

  it("gets all recipes", () => {
    mockDb.getAllSync.mockReturnValue([
      { id: 1, name: "Paella", ingredients: "[]", steps: "[]" },
    ]);
    mockDb.getAllSync.mockReturnValueOnce([{ id: 1, name: "Paella" }]);

    const recipes = getAllRecipes();
    expect(recipes).toHaveLength(1);
    expect(recipes[0].name).toBe("Paella");
  });

  it("updates a recipe", () => {
    const recipe = {
      id: 1,
      name: "Paella actualizada",
      description: null,
      ingredients: ["arroz", "pollo", "azafrán"],
      steps: ["cocinar"],
      mealTypes: [{ id: 1, name: "Almuerzo" }],
      labels: [{ id: 1, name: "Proteína" }],
    };

    updateRecipe(recipe);

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE recipes"),
      expect.arrayContaining(["Paella actualizada", 1]),
    );
    // Previous relationships are deleted
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM recipe_meal_types"),
      [1],
    );
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM recipe_labels"),
      [1],
    );
  });

  it("does not update a recipe without id", () => {
    const recipe = {
      id: undefined,
      name: "no id",
      description: null,
      ingredients: [],
      steps: [],
      mealTypes: [],
      labels: [],
    };

    updateRecipe(recipe);

    expect(mockDb.runSync).not.toHaveBeenCalled();
  });

  it("deletes a recipe", () => {
    deleteRecipe(1);

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM recipes"),
      [1],
    );
  });

  it("does not delete a recipe without id", () => {
    deleteRecipe(undefined);

    expect(mockDb.runSync).not.toHaveBeenCalled();
  });

  it("gets all recipes with mealTypes and labels", () => {
    mockDb.getAllSync
      .mockReturnValueOnce([
        {
          id: 1,
          name: "Paella",
          ingredients: '["arroz","pollo"]',
          steps: '["cocinar"]',
        },
      ])
      .mockReturnValueOnce([{ id: 1, name: "Almuerzo" }]) // mealTypes
      .mockReturnValueOnce([{ id: 1, name: "Proteína" }]); // labels

    const recipes = getAllRecipes();

    expect(recipes).toHaveLength(1);
    expect(recipes[0].mealTypes).toEqual([{ id: 1, name: "Almuerzo" }]);
    expect(recipes[0].labels).toEqual([{ id: 1, name: "Proteína" }]);
    expect(recipes[0].ingredients).toEqual(["arroz", "pollo"]);
    expect(recipes[0].steps).toEqual(["cocinar"]);
  });

  it("returns empty array when no recipes", () => {
    mockDb.getAllSync.mockReturnValueOnce([]);

    const recipes = getAllRecipes();

    expect(recipes).toHaveLength(0);
  });

  it("handles recipes with empty ingredients and steps", () => {
    mockDb.getAllSync
      .mockReturnValueOnce([
        { id: 1, name: "Paella", ingredients: null, steps: null },
      ])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    const recipes = getAllRecipes();

    expect(recipes[0].ingredients).toEqual([]);
    expect(recipes[0].steps).toEqual([]);
  });

  it("creates a recipe with mealTypes and labels", () => {
    mockDb.getFirstSync.mockReturnValueOnce({ id: 1 });

    const recipe = {
      id: undefined,
      name: "Paella",
      description: null,
      ingredients: ["arroz", "pollo"],
      steps: ["cocinar"],
      mealTypes: [
        { id: 1, name: "Almuerzo" },
        { id: 2, name: "Cena" },
      ],
      labels: [{ id: 1, name: "Proteína" }],
    };

    createRecipe(recipe);

    // comprueba que inserta las relaciones de mealTypes
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO recipe_meal_types"),
      [1, 1],
    );
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO recipe_meal_types"),
      [1, 2],
    );

    // comprueba que inserta las relaciones de labels
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO recipe_labels"),
      [1, 1],
    );
  });

  it("does not insert relations if recipe was not created", () => {
    mockDb.getFirstSync.mockReturnValueOnce(null);

    const recipe = {
      id: undefined,
      name: "Paella",
      description: null,
      ingredients: [],
      steps: [],
      mealTypes: [{ id: 1, name: "Almuerzo" }],
      labels: [],
    };

    createRecipe(recipe);

    expect(mockDb.runSync).not.toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO recipe_meal_types"),
      expect.anything(),
    );
  });
});

describe("Preferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets a preference", () => {
    mockDb.getFirstSync.mockReturnValueOnce({ value: "en" });

    const result = getPreference("language");

    expect(result).toBe("en");
    expect(mockDb.getFirstSync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT value FROM preferences"),
      ["language"],
    );
  });

  it("returns null if preference does not exist", () => {
    mockDb.getFirstSync.mockReturnValueOnce(null);

    const result = getPreference("language");

    expect(result).toBeNull();
  });

  it("sets a preference", () => {
    setPreference("language", "en");

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT OR REPLACE INTO preferences"),
      ["language", "en"],
    );
  });
});

describe("MealTypes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets all meal types", () => {
    mockDb.getAllSync.mockReturnValueOnce([
      { id: 1, name: "Almuerzo" },
      { id: 2, name: "Cena" },
    ]);

    const mealTypes = getAllMealTypes();

    expect(mealTypes).toHaveLength(2);
    expect(mealTypes[0].name).toBe("Almuerzo");
  });

  it("creates a meal type", () => {
    createMealType("Desayuno");

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO meal_types"),
      ["Desayuno"],
    );
  });

  it("deletes a meal type", () => {
    deleteMealType(1);

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM meal_types"),
      [1],
    );
  });
});

describe("Labels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets all labels", () => {
    mockDb.getAllSync.mockReturnValueOnce([
      { id: 1, name: "Proteína" },
      { id: 2, name: "Hidratos" },
    ]);

    const labels = getAllLabels();

    expect(labels).toHaveLength(2);
    expect(labels[0].name).toBe("Proteína");
  });

  it("creates a label", () => {
    createLabel("Fibra");

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO labels"),
      ["Fibra"],
    );
  });

  it("deletes a label", () => {
    deleteLabel(1);

    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM labels"),
      [1],
    );
  });
});
