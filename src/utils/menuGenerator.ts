import { Recipe, MealType, Label, MenuRecipe } from "../types/recipeType";
import moment from "moment";

//Fisher-Yates shuffle
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateMenuRecipes = (
  recipes: Recipe[],
  selectedMealTypes: MealType[],
  selectedLabels: Label[],
  labelCount: Record<number, number>,
  recentRecipeIds: Set<number>,
): MenuRecipe[] => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const startIndex = moment().day();
  const weekDays = Array.from(
    { length: 7 },
    (_, i) => daysOfWeek[(startIndex + i) % 7],
  );

  const menuRecipes: MenuRecipe[] = [];
  const usedRecipeIds = new Set<number>();
  const labelUsageCount: Record<number, number> = {};
  const previousDayLabels = new Set<number>();

  selectedLabels.forEach((l) => {
    labelUsageCount[l.id] = 0;
  });

  for (const day of weekDays) {
    const currentDayLabels = new Set<number>();

    for (const mealType of selectedMealTypes) {
      const validRecipes = recipes.filter((r) =>
        r.mealTypes.some((mt) => mt.id === mealType.id),
      );

      const shuffled = shuffle(validRecipes);

      const selected =
        shuffled.find(
          (r) =>
            !usedRecipeIds.has(r.id!) &&
            !recentRecipeIds.has(r.id!) &&
            r.labels.some(
              (l) => labelUsageCount[l.id] < (labelCount[l.id] ?? 2),
            ) &&
            r.labels.every((l) => !previousDayLabels.has(l.id)),
        ) ??
        shuffled.find(
          (r) =>
            !usedRecipeIds.has(r.id!) &&
            !recentRecipeIds.has(r.id!) &&
            r.labels.some(
              (l) => labelUsageCount[l.id] < (labelCount[l.id] ?? 2),
            ),
        ) ??
        shuffled.find(
          (r) => !usedRecipeIds.has(r.id!) && !recentRecipeIds.has(r.id!),
        ) ??
        shuffled.find((r) => !usedRecipeIds.has(r.id!)) ??
        shuffled[0];

      if (selected) {
        menuRecipes.push({ recipe: selected, mealType, weekDay: day });
        usedRecipeIds.add(selected.id!);
        selected.labels.forEach((l) => {
          currentDayLabels.add(l.id);
          if (labelUsageCount[l.id] !== undefined) {
            labelUsageCount[l.id]++;
          }
        });
      }
    }

    previousDayLabels.clear();
    currentDayLabels.forEach((id) => previousDayLabels.add(id));
  }

  return menuRecipes;
};
