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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.darkOrange} />
          <Text style={styles.buttonText}>
            <Trans>Go Back</Trans>
          </Text>
        </Pressable>
        <Text style={styles.label}>
          <Trans>Name</Trans> <Text style={{ color: colors.red }}>*</Text>
        </Text>
        <Controller
          name="name"
          control={control}
          rules={{
            required: { value: true, message: "This field is required." },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={_(msg`Add name...`)}
              placeholderTextColor={colors.lightBrown}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />

        {errors.name && (
          <HelperText type="error">{errors.name?.message}</HelperText>
        )}

        <Text style={styles.label}>
          <Trans>Type of meal</Trans>{" "}
          <Text style={{ color: colors.red }}>*</Text>
        </Text>
        <View style={styles.chipContainer}>
          <Controller
            name="mealTypes"
            control={control}
            rules={{
              required: { value: true, message: "This field is required." },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipContainer}>
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

        <Text style={styles.label}>
          <Trans>Category</Trans> <Text style={{ color: colors.red }}>*</Text>
        </Text>
        <View style={styles.chipContainer}>
          <Controller
            name="labels"
            control={control}
            rules={{
              required: { value: true, message: "This field is required." },
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
                    >
                      {t(label.name)}
                    </Chip>
                  );
                })}
              </View>
            )}
          />
        </View>
        {/* Ingredientes */}
        <Text style={styles.label}>
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
                    color={colors.lightBrown}
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
                />
                <Pressable onPress={() => removeIngredient(index)}>
                  <View style={{ paddingBottom: 15 }}>
                    <Entypo name="trash" size={24} color={colors.lightBrown} />
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
        >
          <Entypo
            name="plus"
            size={24}
            color={colors.lightBrown}
            style={styles.addButton}
          />
          <Text style={styles.text}>
            <Trans>Add Ingredient</Trans>
          </Text>
        </Pressable>

        {/* Pasos */}
        <Text style={styles.label}>
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
                  <Text style={styles.enum}>{index + 1 + "."}</Text>
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
                />
                <Pressable onPress={() => removeStep(index)}>
                  <View style={{ paddingBottom: 15 }}>
                    <Entypo name="trash" size={24} color={colors.lightBrown} />
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
        >
          <Entypo
            name="plus"
            size={24}
            color={colors.lightBrown}
            style={styles.addButton}
          />
          <Text style={styles.text}>
            <Trans>Add Step</Trans>
          </Text>
        </Pressable>

        <DashedButton
          title={_(msg`Save`)}
          color={colors.purple}
          background={colors.transparentYellow}
          style={{ alignSelf: "center", marginTop: 50 }}
          size={{ paddingHorizontal: 50 }}
          onPress={handleSubmit(onSubmit)}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparentYellow,
    paddingHorizontal: 20,
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
    marginBottom: 20,
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
