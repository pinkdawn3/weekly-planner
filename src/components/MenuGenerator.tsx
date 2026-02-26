import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import {
  TextInput,
  ActivityIndicator,
  Chip,
  Portal,
  Modal,
} from "react-native-paper";
import { RecipeContext } from "../contexts/RecipeContext";
import { Label, MealType, MenuRecipe } from "../types/RecipeType";
import moment from "moment";
import {
  createMenu,
  getLastMenu,
  getLastMenus,
} from "../services/database.service";
import ManageMealTypes from "./MenuSettings/ManageMealTypes";
import ManageLabels from "./MenuSettings/ManageLabel";

interface MenuGeneratorProps {
  onCloseModal: () => void;
}

const MenuGenerator: React.FC<MenuGeneratorProps> = ({ onCloseModal }) => {
  const { recipes, setCurrentMenu, setMenuCreated, mealTypes, labels } =
    useContext(RecipeContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedLabels, setSelectedLabels] = useState(labels);
  const toggleLabel = (label: Label) => {
    const exists = selectedLabels.some((l) => l.id === label.id);
    if (exists) {
      setSelectedLabels((prev) => prev.filter((l) => l.id !== label.id));
    } else {
      setSelectedLabels((prev) => [...prev, label]);
    }
  };

  // Preferencias dinámicas: { labelId: cantidad }
  const [labelCount, setLabelCount] = useState<Record<number, number>>(() => {
    const defaults: Record<number, number> = {};
    selectedLabels.forEach((l) => {
      defaults[l.id] = 2;
    });
    return defaults;
  });

  const updateLabelCount = (labelId: number, value: string) => {
    setLabelCount((prev) => ({
      ...prev,
      [labelId]: value === "" ? 0 : parseInt(value),
    }));
  };

  const [selectedMealTypes, setSelectedMealTypes] =
    useState<MealType[]>(mealTypes);

  const toggleMealType = (mealType: MealType) => {
    const exists = selectedMealTypes.some((mt) => mt.id === mealType.id);
    if (exists) {
      setSelectedMealTypes((prev) =>
        prev.filter((mt) => mt.id !== mealType.id),
      );
    } else {
      setSelectedMealTypes((prev) => [...prev, mealType]);
    }
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
    if (selectedMealTypes.length === 0) return;
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
    selectedLabels.forEach((l) => {
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
                (l) => labelUsageCount[l.id] < (labelCount[l.id] ?? 2),
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
        <Text style={styles.sectionTitle}>Tipos de comida</Text>
        <View style={styles.chipContainer}>
          {mealTypes.map((mt) => (
            <Chip
              key={mt.id}
              selected={selectedMealTypes.some((s) => s.id === mt.id)}
              onPress={() => toggleMealType(mt)}
              style={styles.chip}
            >
              {mt.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.chipContainer}>
          {labels.map((l) => (
            <Chip
              key={l.id}
              selected={selectedLabels.some((s) => s.id === l.id)}
              onPress={() => toggleLabel(l)}
              style={styles.chip}
            >
              {l.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Cantidad por categoría</Text>
        {selectedLabels.map((l) => (
          <TextInput
            key={l.id}
            label={l.name}
            value={labelCount[l.id]?.toString() ?? "2"}
            onChangeText={(value) => updateLabelCount(l.id, value)}
            keyboardType="numeric"
            style={styles.input}
          />
        ))}

        <Pressable
          style={[
            styles.button,
            selectedMealTypes.length === 0 && styles.disabledButton,
          ]}
          onPress={generateMenu}
          disabled={selectedMealTypes.length === 0}
        >
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
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
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
});

export default MenuGenerator;
