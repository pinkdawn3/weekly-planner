import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import React, { useContext } from "react";
import { TextInput, Chip } from "react-native-paper";
import { Recipe, MealType, Label } from "../types/RecipeType";
import { RecipeContext } from "../contexts/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createRecipe, getAllRecipes } from "../services/database.service";

type AddRecipeNavProp = StackNavigationProp<RootStackParamList, "AddRecipe">;

const AddRecipe: React.FC = () => {
  const { mealTypes, labels, setRecipes } = useContext(RecipeContext);
  const navigation = useNavigation<AddRecipeNavProp>();

  const [recipe, setRecipe] = React.useState<Recipe>({
    id: undefined,
    name: "",
    description: "",
    ingredients: [],
    steps: [],
    mealTypes: [],
    labels: [],
  });

  const handleSave = () => {
    createRecipe(recipe);
    setRecipes(getAllRecipes());
    navigation.goBack();
  };

  const toggleMealType = (mealType: MealType) => {
    const exists = recipe.mealTypes.some((mt) => mt.id === mealType.id);
    if (exists) {
      setRecipe((prev) => ({
        ...prev,
        mealTypes: prev.mealTypes.filter((mt) => mt.id !== mealType.id),
      }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        mealTypes: [...prev.mealTypes, mealType],
      }));
    }
  };

  const toggleLabel = (label: Label) => {
    const exists = recipe.labels.some((l) => l.id === label.id);
    if (exists) {
      setRecipe((prev) => ({
        ...prev,
        labels: prev.labels.filter((l) => l.id !== label.id),
      }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        labels: [...prev.labels, label],
      }));
    }
  };

  return (
    <ScrollView>
      <View>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Inserte nombre..."
          value={recipe.name}
          onChangeText={(text) =>
            setRecipe((prev) => ({ ...prev, name: text }))
          }
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Inserte descripción..."
          value={recipe.description}
          onChangeText={(text) =>
            setRecipe((prev) => ({ ...prev, description: text }))
          }
        />

        <Text style={styles.label}>Tipo de comida</Text>
        <View style={styles.chipContainer}>
          {mealTypes.map((mt) => (
            <Chip
              key={mt.id}
              selected={recipe.mealTypes.some((r) => r.id === mt.id)}
              onPress={() => toggleMealType(mt)}
              style={styles.chip}
            >
              {mt.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.chipContainer}>
          {labels.map((l) => (
            <Chip
              key={l.id}
              selected={recipe.labels.some((r) => r.id === l.id)}
              onPress={() => toggleLabel(l)}
              style={styles.chip}
            >
              {l.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.label}>Ingredientes</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Añadir ingrediente..."
              value={ingredient}
              onChangeText={(text) =>
                setRecipe((prev) => {
                  const newIngredients = [...prev.ingredients];
                  newIngredients[index] = text;
                  return { ...prev, ingredients: newIngredients };
                })
              }
              onBlur={() => {
                if (!ingredient.trim()) {
                  setRecipe((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.filter((_, i) => i !== index),
                  }));
                }
              }}
            />
            <Pressable
              onPress={() =>
                setRecipe((prev) => ({
                  ...prev,
                  ingredients: prev.ingredients.filter((_, i) => i !== index),
                }))
              }
            >
              <Text>🗑</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          onPress={() =>
            setRecipe((prev) => ({
              ...prev,
              ingredients: [...prev.ingredients, ""],
            }))
          }
        >
          <Text>+ Añadir ingrediente</Text>
        </Pressable>

        <Text style={styles.label}>Pasos</Text>
        {recipe.steps.map((step, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Inserte paso..."
              value={step}
              onChangeText={(text) =>
                setRecipe((prev) => {
                  const newSteps = [...prev.steps];
                  newSteps[index] = text;
                  return { ...prev, steps: newSteps };
                })
              }
              onBlur={() => {
                if (!step.trim()) {
                  setRecipe((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.filter((_, i) => i !== index),
                  }));
                }
              }}
            />
            <Pressable
              onPress={() =>
                setRecipe((prev) => ({
                  ...prev,
                  steps: prev.steps.filter((_, i) => i !== index),
                }))
              }
            >
              <Text>🗑</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          onPress={() =>
            setRecipe((prev) => ({ ...prev, steps: [...prev.steps, ""] }))
          }
        >
          <Text>+ Añadir paso</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Añadir</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "bold",
    color: "black",
  },
});
