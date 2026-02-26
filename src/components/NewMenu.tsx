import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import { TextInput, RadioButton, ActivityIndicator } from "react-native-paper";
import { RecipeContext } from "../contexts/RecipeContext";
import { MenuRecipe, Recipe, MealType } from "../types/RecipeType";
import moment from "moment";
import {
  createMenu,
  getLastMenu,
  getLastMenus,
} from "../services/database.service";

interface NewMenuProps {
  onCloseModal: () => void;
}

const NewMenu: React.FC<NewMenuProps> = ({ onCloseModal }) => {
  const { recipes, setCurrentMenu, setMenuCreated, mealTypes, labels } =
    useContext(RecipeContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [menuType, setMenuType] = useState<"predefined" | "custom">(
    "predefined",
  );

  // Preferencias dinámicas: { labelId: cantidad }
  const [preferences, setPreferences] = useState<Record<number, number>>(() => {
    const defaults: Record<number, number> = {};
    labels.forEach((l) => {
      defaults[l.id] = 2; // 2 por defecto para cada label
    });
    return defaults;
  });

  const updatePreference = (labelId: number, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [labelId]: value === "" ? 0 : parseInt(value),
    }));
  };

  // Fisher-Yates shuffle
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateMenu = () => {
    setLoading(true);

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

    // Recetas usadas en el menú anterior para evitar repeticiones
    const lastMenus = getLastMenus(1);
    const recentRecipeIds = new Set(
      lastMenus.flatMap((m) => m.recipes.map((mr) => mr.recipe.id!)),
    );

    const menuRecipes: MenuRecipe[] = [];
    const usedRecipeIds = new Set<number>();
    const labelUsageCount: Record<number, number> = {};
    labels.forEach((l) => {
      labelUsageCount[l.id] = 0;
    });

    for (const day of weekDays) {
      for (const mealType of mealTypes) {
        // Recetas válidas para este meal type
        const validRecipes = recipes.filter((r) =>
          r.mealTypes.some((mt) => mt.id === mealType.id),
        );

        const shuffled = shuffle(validRecipes);

        // Intentamos encontrar la mejor receta según prioridad
        const selected =
          // 1. No usada en este menú, no usada recientemente, respeta preferencias
          shuffled.find(
            (r) =>
              !usedRecipeIds.has(r.id!) &&
              !recentRecipeIds.has(r.id!) &&
              r.labels.some(
                (l) => labelUsageCount[l.id] < (preferences[l.id] ?? 2),
              ),
          ) ??
          // 2. No usada en este menú, no usada recientemente
          shuffled.find(
            (r) => !usedRecipeIds.has(r.id!) && !recentRecipeIds.has(r.id!),
          ) ??
          // 3. No usada en este menú
          shuffled.find((r) => !usedRecipeIds.has(r.id!)) ??
          // 4. Fallback: cualquier receta válida (repetición permitida)
          shuffled[0];

        if (selected) {
          menuRecipes.push({ recipe: selected, mealType, weekDay: day });
          usedRecipeIds.add(selected.id!);
          selected.labels.forEach((l) => {
            if (labelUsageCount[l.id] !== undefined) {
              labelUsageCount[l.id]++;
            }
          });
        }
      }
    }

    try {
      createMenu(menuRecipes);
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
    <ScrollView>
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
            {labels.map((l) => (
              <TextInput
                key={l.id}
                label={l.name}
                value={preferences[l.id]?.toString() ?? "2"}
                onChangeText={(value) => updatePreference(l.id, value)}
                keyboardType="numeric"
                style={styles.input}
              />
            ))}
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
    </ScrollView>
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
