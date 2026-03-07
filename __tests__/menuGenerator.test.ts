// __tests__/menuGenerator.test.ts
import { generateMenuRecipes } from "../src/utils/menuGenerator";
import { Recipe, MealType, Label } from "../src/types/recipeType";

const mealTypeLunch: MealType = { id: 1, name: "Lunch" };
const mealTypeDinner: MealType = { id: 2, name: "Dinner" };
const labelProtein: Label = { id: 1, name: "Protein" };
const labelCarbs: Label = { id: 2, name: "Carbs" };

const makeRecipe = (
  id: number,
  mealTypes: MealType[],
  labels: Label[],
): Recipe => ({
  id,
  name: `Recipe ${id}`,
  description: "",
  ingredients: [],
  steps: [],
  mealTypes,
  labels,
});

describe("generateMenuRecipes", () => {
  it("generates 7 recipes for one meal type", () => {
    const recipes = Array.from({ length: 10 }, (_, i) =>
      makeRecipe(i + 1, [mealTypeLunch], [labelProtein]),
    );

    const result = generateMenuRecipes(
      recipes,
      [mealTypeLunch],
      [labelProtein],
      { 1: 2 },
      new Set(),
    );

    expect(result).toHaveLength(7);
    expect(result.every((mr) => mr.mealType.id === mealTypeLunch.id)).toBe(
      true,
    );
  });

  it("generates 14 recipes for two meal types", () => {
    const recipes = Array.from({ length: 10 }, (_, i) =>
      makeRecipe(i + 1, [mealTypeLunch, mealTypeDinner], [labelProtein]),
    );

    const result = generateMenuRecipes(
      recipes,
      [mealTypeLunch, mealTypeDinner],
      [],
      {},
      new Set(),
    );

    expect(result).toHaveLength(14);
  });

  it("avoids recently used recipes when possible", () => {
    const recipes = Array.from({ length: 10 }, (_, i) =>
      makeRecipe(i + 1, [mealTypeLunch], []),
    );
    const recentRecipeIds = new Set([1, 2, 3, 4, 5, 6, 7]);

    const result = generateMenuRecipes(
      recipes,
      [mealTypeLunch],
      [],
      {},
      recentRecipeIds,
    );

    // debería usar recetas 8, 9, 10 preferentemente
    const usedIds = result.map((mr) => mr.recipe.id!);
    const usedRecentCount = usedIds.filter((id) =>
      recentRecipeIds.has(id),
    ).length;
    expect(usedRecentCount).toBeLessThan(7);
  });

  it("falls back to repeating recipes when not enough", () => {
    const recipes = [
      makeRecipe(1, [mealTypeLunch], []),
      makeRecipe(2, [mealTypeLunch], []),
    ];

    const result = generateMenuRecipes(
      recipes,
      [mealTypeLunch],
      [],
      {},
      new Set(),
    );

    expect(result).toHaveLength(7);
  });

  it("returns empty array when no recipes match meal type", () => {
    const recipes = [makeRecipe(1, [mealTypeDinner], [])];

    const result = generateMenuRecipes(
      recipes,
      [mealTypeLunch],
      [],
      {},
      new Set(),
    );

    expect(result).toHaveLength(0);
  });
});
