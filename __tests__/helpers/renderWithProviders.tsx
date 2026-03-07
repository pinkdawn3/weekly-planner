import React from "react";
import { render } from "@testing-library/react-native";
import { RecipeContext } from "../../src/contexts/Recipe/RecipeContext";
import { PaperProvider } from "react-native-paper";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { UserContext } from "../../src/contexts/User/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const mockUserContext = {
  theme: "light" as const,
  toggleTheme: jest.fn(),
  language: "en" as const,
  setLanguage: jest.fn(),
  handleSetLanguage: jest.fn(),
};

export const mockRecipeContext = {
  recipe: {
    id: undefined,
    name: "",
    description: "",
    ingredients: [],
    steps: [],
    mealTypes: [],
    labels: [],
  },
  setRecipe: jest.fn(),
  recipes: [],
  setRecipes: jest.fn(),
  mealTypes: [{ id: 1, name: "Lunch" }],
  labels: [{ id: 1, name: "Protein" }],
  setMealTypes: jest.fn(),
  setLabels: jest.fn(),
  currentMenu: { id: 0, created: "", recipes: [] },
  setCurrentMenu: jest.fn(),
  menuCreated: false,
  setMenuCreated: jest.fn(),
};

export const renderWithProviders = (component: React.ReactElement) => {
  console.log("I18nProvider:", I18nProvider);
  console.log("PaperProvider:", PaperProvider);
  console.log("i18n:", i18n);

  return render(
    <SafeAreaProvider>
      <I18nProvider i18n={i18n}>
        <PaperProvider>
          <UserContext.Provider value={mockUserContext}>
            <RecipeContext.Provider value={mockRecipeContext}>
              {component}
            </RecipeContext.Provider>
          </UserContext.Provider>
        </PaperProvider>
      </I18nProvider>
    </SafeAreaProvider>,
  );
};
