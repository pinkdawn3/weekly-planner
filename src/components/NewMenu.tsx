import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { TextInput, RadioButton, ActivityIndicator } from "react-native-paper";
import { RecipeContext } from "../contexts/RecipeContext";
import { Menu, MenuPetition, Preferences, Recipe } from "../types/RecipeType";

import { UserInfoContext } from "../contexts/UserInfoContext";
import moment from "moment";
import RecipeService from "../services/recipes.service";
import MenuService from "../services/menu.service";

const defaultPreferences: Preferences = {
  hidratos: 3,
  fibra: 2,
  proteína: 2,
  pescado: 1,
};

interface NewMenuProps {
  onCloseModal: () => void;
}

const NewMenu: React.FC<NewMenuProps> = ({ onCloseModal }) => {
  const { recipes, setCurrentMenu, setMenuCreated } = useContext(RecipeContext);
  const { currentUser } = useContext(UserInfoContext);

  //State that store preferences and loading state
  const [loading, setLoading] = useState<boolean>(false); //
  const [menuType, setMenuType] = useState<"predefined" | "custom">(
    "predefined"
  );
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  //Function that will take user input to update preferences on how many times each type of food must be used in the
  //generator
  const updatePreference = (key: keyof Preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseInt(value),
    }));
  };

  //Function that sends to the database the recipes with each assiged day on the menu
  const updateRecipeDay = async (recipe: Recipe) => {
    try {
      await RecipeService.updateRecipe(recipe);
    } catch (error) {
      console.error(`Error updating recipe ${recipe.id}:`, error);
    }
  };

  const generateMenu = async () => {
    setLoading(true);

    let selectedRecipes: Recipe[] = [];
    let lastUsedLabels: string[] = [];
    let usedRecipes: Set<number> = new Set();

    // Randomize the order of recipes to ensure variety.
    recipes.sort(() => 0.5 - Math.random());

    // Loop until we have selected 7 recipes.
    while (selectedRecipes.length < 7) {
      // Filter recipes based on user preferences, recent usage, and avoiding duplicates.
      const availableRecipes = recipes.filter((recipe) => {
        const notUsedRecently = !lastUsedLabels.includes(recipe.label);
        const notUsedInMenu = !usedRecipes.has(recipe.id!); //
        const labelCount = selectedRecipes.filter(
          (r) => r.label === recipe.label
        ).length;
        return (
          notUsedRecently &&
          notUsedInMenu &&
          labelCount < (preferences[recipe.label] || 0)
        );
      });

      if (availableRecipes.length > 0) {
        const recipe = availableRecipes[0];
        selectedRecipes.push(recipe); // Add the recipe to the selected recipes.
        lastUsedLabels.push(recipe.label); // Track the label of the used recipe.
        usedRecipes.add(recipe.id!); // Track the recipe ID to avoid duplicates.
        if (lastUsedLabels.length > 2) lastUsedLabels.shift(); // Keep the last 2 labels in the tracking array.
      } else {
        // If no recipes fit the criteria, select a fallback recipe.
        const fallbackRecipes = recipes.filter(
          (recipe) => !usedRecipes.has(recipe.id!)
        );
        const randomRecipe =
          fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)] ||
          null; // Select a random recipe from the fallback recipes.
        if (randomRecipe) {
          selectedRecipes.push(randomRecipe); // Add the fallback recipe to the selected recipes.
          lastUsedLabels.push(randomRecipe.label); // Track the label of the used fallback recipe.
          usedRecipes.add(randomRecipe.id!); // Track the recipe ID to avoid duplicates.
          if (lastUsedLabels.length > 2) lastUsedLabels.shift(); // Keep the last 2 labels in the tracking array.
        }
      }
    }

    // Assign days of the week to the recipes starting from today
    const startIndex = moment().day();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < selectedRecipes.length; i++) {
      selectedRecipes[i].weekDay = daysOfWeek[(startIndex + i) % 7];
      await updateRecipeDay(selectedRecipes[i]); // Updates the recipe in the database
    }

    const recipeRequest: MenuPetition = {
      recipeDtoList: selectedRecipes,
    };

    try {
      // Send the generated menu to the backend service.
      console.log(recipeRequest);
      await MenuService.createMenu(recipeRequest, currentUser.id);

      // Obtener el último menú guardado
      const lastMenu: Menu = await MenuService.getLastMenu(currentUser.id);
      setCurrentMenu(lastMenu.recipes);
      setMenuCreated(true);
      onCloseModal();
    } catch (error) {
      console.error("Error creating menu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <RadioButton.Group
        onValueChange={(newValue) =>
          setMenuType(newValue as "predefined" | "custom")
        }
        value={menuType}
      >
        <RadioButton.Item label="Menú Predefinido" value="predefined" />
        <RadioButton.Item label="Menú Personalizado" value="custom" />
      </RadioButton.Group>

      {menuType === "custom" && (
        <View>
          <TextInput
            label="Hidratos"
            value={preferences.hidratos.toString()}
            onChangeText={(value) => updatePreference("hidratos", value)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Fibra"
            value={preferences.fibra.toString()}
            onChangeText={(value) => updatePreference("fibra", value)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Proteína"
            value={preferences.proteína.toString()}
            onChangeText={(value) => updatePreference("proteína", value)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Pescado"
            value={preferences.pescado.toString()}
            onChangeText={(value) => updatePreference("pescado", value)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      )}

      <Pressable style={styles.button} onPress={generateMenu}>
        {loading ? (
          <ActivityIndicator animating={true} color="white" />
        ) : (
          <Text style={styles.buttonText}>Generar Menú</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#f28966",
    borderWidth: 1,
    borderColor: "gray",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

export default NewMenu;
