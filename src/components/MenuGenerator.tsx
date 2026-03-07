import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { TextInput, Chip, HelperText } from "react-native-paper";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { Label, MealType, Menu, MenuRecipe } from "../types/recipeType";
import moment from "moment";
import {
  createMenu,
  getLastMenu,
  getLastMenus,
} from "../services/db/database.service";
import { colors } from "../theme/colors";
import DashedButton from "./Core/DashedButton";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useTranslate } from "../hooks/useTranslations";
import { generateMenuRecipes } from "../utils/menuGenerator";

interface MenuGeneratorProps {
  onCloseModal: () => void;
}

const MenuGenerator: React.FC<MenuGeneratorProps> = ({ onCloseModal }) => {
  const { recipes, setCurrentMenu, setMenuCreated, mealTypes, labels } =
    useContext(RecipeContext);

  const { _ } = useLingui();
  const t = useTranslate();

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

  // Error management
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const updateLabelCount = (labelId: number, value: string) => {
    const count = value === "" ? 0 : parseInt(value);

    setLabelCount((prev) => ({ ...prev, [labelId]: count }));

    const recipesWithLabel = recipes.filter((r) =>
      r.labels.some((l) => l.id === labelId),
    ).length;

    setErrors((prev) => ({
      ...prev,
      [labelId]: count > recipesWithLabel ? _(msg`Not enough recipes.`) : null,
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

  const generateMenu = () => {
    if (selectedMealTypes.length === 0) return;

    // validaciones
    const newErrors: Record<number, string | null> = {};
    let hasErrors = false;

    selectedLabels.forEach((l) => {
      const recipesWithLabel = recipes.filter((r) =>
        r.labels.some((rl) => rl.id === l.id),
      ).length;

      if (labelCount[l.id] > recipesWithLabel) {
        newErrors[l.id] = _(msg`Not enough recipes.`);
        hasErrors = true;
      } else {
        newErrors[l.id] = null;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    // 👇 esto es lo que tienes suelto, tiene que ir aquí
    const lastMenus = getLastMenus(1);
    const recentRecipeIds = new Set(
      lastMenus.flatMap((m: Menu) =>
        m.recipes.map((mr: MenuRecipe) => mr.recipe.id!),
      ),
    );

    const menuRecipes = generateMenuRecipes(
      recipes,
      selectedMealTypes,
      selectedLabels,
      labelCount,
      recentRecipeIds,
    );

    try {
      createMenu(menuRecipes);
      const lastMenu = getLastMenu();
      setCurrentMenu(
        lastMenu ?? { id: 0, created: "", recipes: [], structure: [] },
      );
      setMenuCreated(true);
      onCloseModal();
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          <Trans>Type of meal</Trans>
        </Text>
        <View style={styles.chipContainer}>
          {mealTypes.map((mt) => (
            <Chip
              key={mt.id}
              selected={selectedMealTypes.some((s) => s.id === mt.id)}
              onPress={() => toggleMealType(mt)}
              style={styles.chip}
              textStyle={{
                fontFamily: "ShantellSans-Regular",
                color: colors.darkBrown,
              }}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: selectedMealTypes.some((s) => s.id === mt.id),
              }}
              accessibilityLabel={t(mt.name)}
            >
              {t(mt.name)}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          <Trans>Categories</Trans>
        </Text>
        <View style={styles.chipContainer}>
          {labels.map((l) => (
            <Chip
              key={l.id}
              selected={selectedLabels.some((s) => s.id === l.id)}
              onPress={() => toggleLabel(l)}
              style={styles.chip}
              textStyle={{
                fontFamily: "ShantellSans-Regular",
                color: colors.darkBrown,
              }}
            >
              {t(l.name)}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          <Trans>Number per category</Trans>
        </Text>
        {selectedLabels.map((l, index) => (
          <View key={index}>
            <TextInput
              mode="outlined"
              outlineColor={colors.lightBrown}
              activeOutlineColor={colors.lightBrown}
              textColor={colors.lightBrown}
              contentStyle={{
                fontFamily: "ShantellSans-Regular",
                fontSize: 15,
              }}
              key={l.id}
              label={t(l.name)}
              value={labelCount[l.id]?.toString() ?? "2"}
              onChangeText={(value) => updateLabelCount(l.id, value)}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors[l.id]}
              accessibilityLabel={t(l.name)}
              accessibilityHint={_(
                msg`Enter the number of recipes for this category`,
              )}
            />

            <HelperText type="error">{errors[l.id]}</HelperText>
          </View>
        ))}

        <DashedButton
          title={_(msg`Generate menu`)}
          color={colors.purple}
          background={colors.offWhite}
          onPress={generateMenu}
          style={{ alignSelf: "center", marginTop: 20 }}
          size={{ paddingHorizontal: 40 }}
          accessibilityLabel={_(msg`Generate menu`)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
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
    backgroundColor: colors.orange,
    borderRadius: 12,
    fontFamily: "ShantellSans-Regular",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
    fontFamily: "ShantellSans-Regular",
  },
});

export default MenuGenerator;
