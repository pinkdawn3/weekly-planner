import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Chip, HelperText } from "react-native-paper";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { Label, MealType, Menu, MenuRecipe } from "../types/recipeType";
import {
  createMenu,
  getLastMenu,
  getLastMenus,
} from "../services/db/database.service";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useTranslate } from "../hooks/useTranslations";
import { generateMenuRecipes } from "../utils/menuGenerator";
import DashedButton from "../components/Core/DashedButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "../theme/useColors";

type MenuGeneratorNavProp = StackNavigationProp<
  RootStackParamList,
  "MenuGenerator"
>;

const MenuGenerator: React.FC = () => {
  const { recipes, setCurrentMenu, setMenuCreated, mealTypes, labels } =
    useContext(RecipeContext);

  const navigation = useNavigation<MenuGeneratorNavProp>();
  const { _ } = useLingui();
  const t = useTranslate();
  const colors = useColors();

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
    selectedLabels.forEach((label) => {
      if (label.name == "Fish") {
        defaults[label.id] = 1;
      } else {
        defaults[label.id] = 2;
      }
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
      navigation.goBack();
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={_(msg`Go back to recipes`)}
      >
        <Feather name="arrow-left" size={24} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>
          <Trans>Go Back</Trans>
        </Text>
      </Pressable>

      <Text
        style={[styles.heading, { color: colors.text }]}
        accessibilityRole="header"
      >
        <Trans>Create a menu</Trans>
      </Text>

      <FlatList
        data={selectedLabels}
        numColumns={2}
        /*  Type of meal and category chips  */
        ListHeaderComponent={
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
                    color: colors.text,
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

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
                    color: colors.text,
                  }}
                >
                  {t(l.name)}
                </Chip>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Trans>Numbers of meals in a week</Trans>
            </Text>
          </View>
        }
        // Generate Menu button
        ListFooterComponent={
          <DashedButton
            title={_(msg`Generate menu`)}
            color={colors.button}
            background={colors.cardBackground}
            onPress={generateMenu}
            style={{ alignSelf: "center", marginTop: 20 }}
            size={{ paddingHorizontal: 40 }}
            accessibilityLabel={_(msg`Generate menu`)}
          />
        }
        // Columns for numbers of meal in a week
        renderItem={({ item }) => {
          return (
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.border}
                textColor={colors.border}
                contentStyle={{
                  fontFamily: "ShantellSans-Regular",
                  fontSize: 15,
                }}
                label={t(item.name)}
                value={labelCount[item.id]?.toString() ?? "2"}
                onChangeText={(value) => updateLabelCount(item.id, value)}
                keyboardType="numeric"
                style={[
                  styles.input,
                  { backgroundColor: colors.cardBackground },
                ]}
                error={!!errors[item.id]}
                accessibilityLabel={t(item.name)}
                accessibilityHint={_(
                  msg`Enter the number of recipes for this category`,
                )}
              />

              <HelperText type="error">{errors[item.id]}</HelperText>
            </View>
          );
        }}
        keyExtractor={(item) => String(item.id)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  buttonText: {
    marginLeft: 5,
    fontFamily: "ShantellSans-SemiBold",
  },
  heading: {
    fontSize: 22,
    fontFamily: "ShantellSans-Bold",
    alignSelf: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "ShantellSans-SemiBold",
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
    borderRadius: 12,
    fontFamily: "ShantellSans-Regular",
  },
  inputContainer: {
    flex: 1 / 2,
  },

  input: {
    borderRadius: 12,
    fontFamily: "ShantellSans-Regular",
    margin: 4,
  },
});

export default MenuGenerator;
