import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import { Chip, HelperText } from "react-native-paper";
import { Recipe } from "../types/recipeType";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createRecipe, getAllRecipes } from "../services/db/database.service";
import { Controller, useForm } from "react-hook-form";
import DashedButton from "../components/Core/DashedButton";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useTranslate } from "../hooks/useTranslations";
import Toast from "react-native-toast-message";
import { Entypo, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../theme/useColors";

type AddRecipeNavProp = StackNavigationProp<RootStackParamList, "AddRecipe">;

const AddRecipe: React.FC = () => {
  const { mealTypes, labels, setRecipes } = useContext(RecipeContext);
  const navigation = useNavigation<AddRecipeNavProp>();
  const { _ } = useLingui();
  const t = useTranslate();
  const colors = useColors();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  const onSubmitAndGoBack = (data: Recipe) => {
    createRecipe(data);
    setRecipes(getAllRecipes());
    Toast.show({
      type: "success",
      text1: _(msg`Recipe successfully added!`),
    });
    navigation.goBack();
  };

  const onSubmitAndAddAnother = (data: Recipe) => {
    createRecipe(data);
    setRecipes(getAllRecipes());
    Toast.show({
      type: "success",
      text1: _(msg`Recipe successfully added!`),
    });
    reset(); // resetea el form para añadir otra
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={_(msg`Go back to recipes`)}
        >
          <Feather name="arrow-left" size={24} color={colors.textPressable} />
          <Text style={[styles.buttonText, { color: colors.textPressable }]}>
            <Trans>Go Back</Trans>
          </Text>
        </Pressable>
        <Text
          style={[styles.heading, { color: colors.text }]}
          accessibilityRole="header"
        >
          <Trans>Add Recipes</Trans>
        </Text>
        <Text style={[styles.label, { color: colors.text }]}>
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
              placeholderTextColor={colors.textVariant}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              accessibilityLabel={_(msg`Name, required`)}
              accessibilityHint={_(msg`Enter the recipe name`)}
            />
          )}
        />

        {errors.name && (
          <HelperText type="error">{errors.name?.message}</HelperText>
        )}

        <Text style={[styles.label, { color: colors.text }]}>
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
                      style={[styles.chip, { backgroundColor: colors.accent }]}
                      textStyle={{ color: colors.text }}
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

        <Text style={[styles.label, { color: colors.text }]}>
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
                      style={[styles.chip, { backgroundColor: colors.accent }]}
                      textStyle={{ color: colors.text }}
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

        {/* Optional parameters: ingredients and steps */}
        <Text style={[styles.label, { color: colors.text }]}>
          <Trans>Optional</Trans>
        </Text>
        <View
          style={[styles.optionalContainer, { borderColor: colors.border }]}
        >
          {/* Ingredientes */}
          <Text
            style={[styles.label, { color: colors.text }]}
            accessibilityRole="header"
          >
            <Trans>Ingredients</Trans>
          </Text>

          {ingredients.map((ingredient, index) => (
            <Controller
              key={index}
              name={`ingredients.${index}`}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* Padding bottom to match the native padding of the text input
            component */}
                  <View style={{ paddingBottom: 15 }}>
                    <Entypo
                      name="triangle-right"
                      size={24}
                      color={colors.textVariant}
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder={_(msg`Add ingredient...`)}
                    value={value}
                    autoFocus
                    onChangeText={onChange}
                    onBlur={() => {
                      if (!ingredient.trim()) {
                        onBlur();
                      }
                    }}
                    accessibilityHint={_(msg`Add an ingredient`)}
                  />
                  <Pressable
                    onPress={() => removeIngredient(index)}
                    accessibilityRole="button"
                    accessibilityLabel={_(msg`Delete ingredient`)}
                  >
                    <View style={{ paddingBottom: 15 }}>
                      <Entypo
                        name="trash"
                        size={24}
                        color={colors.textVariant}
                      />
                    </View>
                  </Pressable>
                </View>
              )}
            />
          ))}
          {/*  Boton para añadir ingrediente */}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={appendIngredient}
            accessibilityRole="button"
            accessibilityLabel={_(msg`Add a new ingredient`)}
          >
            <Entypo
              name="plus"
              size={24}
              color={colors.textVariant}
              style={[
                styles.addButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.buttonVariant,
                },
              ]}
            />
            <Text style={[styles.text, { color: colors.text }]}>
              <Trans>Add Ingredient</Trans>
            </Text>
          </Pressable>

          {/* Pasos */}
          <Text
            style={[styles.label, { color: colors.text }]}
            accessibilityRole="header"
          >
            <Trans>Steps</Trans>
          </Text>
          {steps.map((step, index) => (
            <Controller
              key={index}
              name={`steps.${index}`}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* Padding bottom to match the native padding of the text input
            component */}
                  <View style={{ paddingBottom: 15 }}>
                    <Text style={[styles.enum, { color: colors.textVariant }]}>
                      {index + 1 + "."}
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder={_(msg`Add step...`)}
                    value={value}
                    autoFocus
                    multiline
                    onChangeText={onChange}
                    onBlur={() => {
                      if (!step.trim()) {
                        onBlur();
                      }
                    }}
                    accessibilityHint={_(msg`Add a new step`)}
                  />
                  <Pressable
                    onPress={() => removeStep(index)}
                    accessibilityRole="button"
                    accessibilityLabel={_(msg`Delete step`)}
                  >
                    <View style={{ paddingBottom: 15 }}>
                      <Entypo
                        name="trash"
                        size={24}
                        color={colors.textVariant}
                      />
                    </View>
                  </Pressable>
                </View>
              )}
            />
          ))}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={appendStep}
            accessibilityRole="button"
            accessibilityLabel={_(msg`Add a new step`)}
          >
            <Entypo
              name="plus"
              size={24}
              color={colors.textVariant}
              style={[
                styles.addButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.buttonVariant,
                },
              ]}
            />
            <Text style={[styles.text, { color: colors.text }]}>
              <Trans>Add Step</Trans>
            </Text>
          </Pressable>
        </View>

        <DashedButton
          title={_(msg`Save`)}
          color={colors.button}
          background={colors.background}
          style={{ alignSelf: "center", marginTop: 50 }}
          size={{ paddingHorizontal: 50 }}
          onPress={handleSubmit(onSubmitAndGoBack)}
          accessibilityLabel={_(msg`Save recipe`)}
        />
        <DashedButton
          title={_(msg`Save and add another`)}
          color={colors.button}
          background={colors.background}
          style={{ alignSelf: "center", marginTop: 20 }}
          size={{ paddingHorizontal: 30 }}
          onPress={handleSubmit(onSubmitAndAddAnother)}
          accessibilityLabel={_(msg`Save recipe`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  optionalContainer: {
    padding: 20,
    borderWidth: 1.5,
    borderRadius: 20,
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
    fontSize: 20,
    fontFamily: "ShantellSans-Bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "ShantellSans-SemiBold",
    marginBottom: 5,
  },
  enum: {
    fontFamily: "ShantellSans-Italic",
    fontSize: 20,
  },
  text: {
    fontFamily: "ShantellSans-Italic",
  },
  input: {
    marginBottom: 30,
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 10,
    backgroundColor: "white",
    fontFamily: "ShantellSans-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
  },
  addButton: {
    borderWidth: 2,
    borderRadius: 10,
    marginRight: 10,
  },
});
