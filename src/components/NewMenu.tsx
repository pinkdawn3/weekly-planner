import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { TextInput, RadioButton, ActivityIndicator } from "react-native-paper";
import { RecipeContext } from "../contexts/RecipeContext";
import { Preferences, Recipe } from "../types/RecipeType";
import moment from "moment";
import {
  updateRecipe,
  createMenu,
  getLastMenu,
} from "../services/database.service";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [menuType, setMenuType] = useState<"predefined" | "custom">(
    "predefined",
  );
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const updatePreference = (key: keyof Preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseInt(value),
    }));
  };

  const updateRecipeDay = (recipe: Recipe) => {
    try {
      updateRecipe(recipe);
    } catch (error) {
      console.error(`Error updating recipe ${recipe.id}:`, error);
    }
  };

  const generateMenu = async () => {
    setLoading(true);

    let selectedRecipes: Recipe[] = [];
    let lastUsedLabels: string[] = [];
    let usedRecipes: Set<number> = new Set();

    recipes.sort(() => 0.5 - Math.random());

    while (selectedRecipes.length < 7) {
      const availableRecipes = recipes.filter((recipe) => {
        const notUsedRecently = !lastUsedLabels.includes(recipe.label);
        const notUsedInMenu = !usedRecipes.has(recipe.id!);
        const labelCount = selectedRecipes.filter(
          (r) => r.label === recipe.label,
        ).length;
        return (
          notUsedRecently &&
          notUsedInMenu &&
          labelCount < (preferences[recipe.label] || 0)
        );
      });

      if (availableRecipes.length > 0) {
        const recipe = availableRecipes[0];
        selectedRecipes.push(recipe);
        lastUsedLabels.push(recipe.label);
        usedRecipes.add(recipe.id!);
        if (lastUsedLabels.length > 2) lastUsedLabels.shift();
      } else {
        const fallbackRecipes = recipes.filter(
          (recipe) => !usedRecipes.has(recipe.id!),
        );
        const randomRecipe =
          fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)] ||
          null;
        if (randomRecipe) {
          selectedRecipes.push(randomRecipe);
          lastUsedLabels.push(randomRecipe.label);
          usedRecipes.add(randomRecipe.id!);
          if (lastUsedLabels.length > 2) lastUsedLabels.shift();
        }
      }
    }

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
      updateRecipeDay(selectedRecipes[i]);
    }

    try {
      createMenu(selectedRecipes);
      const lastMenu = getLastMenu();
      setCurrentMenu(lastMenu ?? { id: 0, created: "", recipes: [] });
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
