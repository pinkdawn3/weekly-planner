import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useContext } from "react";
import { Chip, HelperText } from "react-native-paper";
import { Recipe } from "../types/recipeType";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createRecipe, getAllRecipes } from "../services/db/database.service";
import { colors } from "../theme/colors";
import { Entypo, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Controller, useForm } from "react-hook-form";
import DashedButton from "../components/Core/DashedButton";
import { Trans } from "@lingui/react/macro";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useTranslate } from "../hooks/useTranslations";

type AddRecipeNavProp = StackNavigationProp<RootStackParamList, "AddRecipe">;

const AddRecipe: React.FC = () => {
  const { mealTypes, labels, setRecipes } = useContext(RecipeContext);
  const navigation = useNavigation<AddRecipeNavProp>();
  const { _ } = useLingui();
  const t = useTranslate();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Recipe>({
    defaultValues: {
      name: "",
      ingredients: [],
      steps: [],
      mealTypes: [],
      labels: [],
    },
  });

  const ingredients = watch("ingredients");
  const appendIngredient = () => setValue("ingredients", [...ingredients, ""]);
  const removeIngredient = (index: number) =>
    setValue(
      "ingredients",
      ingredients.filter((_, i) => i !== index),
    );

  const steps = watch("steps");
  const appendStep = () => setValue("steps", [...steps, ""]);
  const removeStep = (index: number) =>
    setValue(
      "steps",
      steps.filter((_, i) => i !== index),
    );

  const onSubmit = (data: Recipe) => {
    createRecipe(data);
    setRecipes(getAllRecipes());
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={_(msg`Go back to recipes`)}
      >
        <Feather name="arrow-left" size={24} color={colors.darkOrange} />
        <Text style={styles.buttonText}>
          <Trans>Go Back</Trans>
        </Text>
      </Pressable>
      <Text style={styles.label} accessibilityRole="header">
        <Trans>Name of recipe</Trans>
      </Text>
      <Controller
        name="name"
        control={control}
        rules={{
          required: {
            value: true,
            message: _(msg`This field is required.`),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={_(msg`Add name...`)}
            placeholderTextColor={colors.lightBrown}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            accessibilityLabel={_(msg`Name, required`)}
            accessibilityHint={_(msg`Enter the recipe name`)}
          />
        )}
      />

      {errors.name && (
        <HelperText type="error">{errors.name?.message}</HelperText>
      )}

      <Text style={styles.label} accessibilityRole="header">
        <Trans>Type of meal</Trans>
      </Text>
      <View style={styles.chipContainer}>
        <Controller
          name="mealTypes"
          control={control}
          rules={{
            required: {
              value: true,
              message: _(msg`This field is required.`),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View
              style={styles.chipContainer}
              accessibilityLabel={_(msg`Type of meal is required`)}
            >
              {mealTypes.map((mt) => {
                const isSelected = value?.some((v) => v.id === mt.id);
                return (
                  <Chip
                    key={mt.id}
                    selected={isSelected}
                    onPress={() => {
                      const newValue = isSelected
                        ? value.filter((v) => v.id !== mt.id)
                        : [...(value || []), mt];
                      onChange(newValue);
                    }}
                    style={styles.chip}
                    textStyle={{ color: colors.darkBrown }}
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked: value.some((s) => s.id === mt.id),
                    }}
                    accessibilityLabel={t(mt.name)}
                  >
                    {t(mt.name)}
                  </Chip>
                );
              })}
            </View>
          )}
        />
      </View>

      {errors.mealTypes && (
        <HelperText type="error">{errors.mealTypes?.message}</HelperText>
      )}

      <Text style={styles.label} accessibilityRole="header">
        <Trans>Category</Trans>
      </Text>
      <View
        style={styles.chipContainer}
        accessibilityLabel={_(msg`Category of meal is required`)}
      >
        <Controller
          name="labels"
          control={control}
          rules={{
            required: {
              value: true,
              message: _(msg`This field is required.`),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipContainer}>
              {labels.map((label) => {
                const isSelected = value?.some((v) => v.id === label.id);
                return (
                  <Chip
                    key={label.id}
                    selected={isSelected}
                    onPress={() => {
                      const newValue = isSelected
                        ? value.filter((v) => v.id !== label.id)
                        : [...(value || []), label];
                      onChange(newValue); //
                    }}
                    style={styles.chip}
                    textStyle={{ color: colors.darkBrown }}
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked: value.some((s) => s.id === label.id),
                    }}
                    accessibilityLabel={t(label.name)}
                  >
                    {t(label.name)}
                  </Chip>
                );
              })}
            </View>
          )}
        />
      </View>
      {errors.labels && (
        <HelperText type="error">{errors.labels?.message}</HelperText>
      )}

      <DashedButton
        title={_(msg`Save`)}
        color={colors.purple}
        background={colors.transparentYellow}
        style={{ alignSelf: "center", marginTop: 50 }}
        size={{ paddingHorizontal: 50 }}
        onPress={handleSubmit(onSubmit)}
        accessibilityLabel={_(msg`Save recipe`)}
      />
    </View>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparentYellow,
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
    color: colors.darkOrange,
  },
  label: {
    fontSize: 14,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
    marginBottom: 5,
  },
  enum: {
    fontFamily: "ShantellSans-Italic",
    color: colors.lightBrown,
    fontSize: 20,
  },
  text: {
    fontFamily: "ShantellSans-Italic",
    color: colors.darkBrown,
  },
  input: {
    marginBottom: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.lightBrown,
    paddingHorizontal: 10,
    backgroundColor: "white",
    color: colors.darkBrown,
    fontFamily: "ShantellSans-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  chip: {
    margin: 4,
    backgroundColor: colors.orange,
  },
  addButton: {
    backgroundColor: colors.pink,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.lightBrown,
    marginRight: 10,
  },
});
