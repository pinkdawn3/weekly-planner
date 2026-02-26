import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { TextInput, Chip } from "react-native-paper";
import { Recipe, MealType, Label } from "../../types/RecipeType";
import { RecipeContext } from "../../contexts/RecipeContext";

interface AddRecipeProps {
  initialRecipe?: Recipe | null;
  onClose: () => void;
  onSave?: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
}

const AddRecipe: React.FC<AddRecipeProps> = ({
  initialRecipe,
  onClose,
  onSave,
  onEdit,
}) => {
  const { mealTypes, labels } = useContext(RecipeContext);
  const isEditing = Boolean(initialRecipe);

  const [recipe, setRecipe] = React.useState<Recipe>({
    id: undefined,
    name: "",
    description: "",
    ingredients: "",
    steps: "",
    mealTypes: [],
    labels: [],
  });

  useEffect(() => {
    if (initialRecipe) {
      setRecipe(initialRecipe);
    }
  }, [initialRecipe]);

  const handleSave = () => {
    if (isEditing && onEdit) {
      onEdit(recipe);
    } else if (!isEditing && onSave) {
      onSave(recipe);
    }
    onClose();
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
        <TextInput
          style={styles.input}
          placeholder="Inserte ingredientes..."
          value={recipe.ingredients}
          onChangeText={(text) =>
            setRecipe((prev) => ({ ...prev, ingredients: text }))
          }
          multiline
        />

        <Text style={styles.label}>Pasos</Text>
        <TextInput
          style={styles.input}
          placeholder="Inserte pasos..."
          value={recipe.steps}
          onChangeText={(text) =>
            setRecipe((prev) => ({ ...prev, steps: text }))
          }
          multiline
        />

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {isEditing ? "Guardar" : "Añadir"}
          </Text>
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
