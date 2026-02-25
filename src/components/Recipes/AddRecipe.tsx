import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { Menu } from "react-native-paper";

import { Recipe } from "../../types/RecipeType";

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
  const isEditing = Boolean(initialRecipe);

  const [recipe, setRecipe] = React.useState<Recipe>({
    id: undefined,
    name: "",
    description: "",
    label: "" as "hidratos" | "fibra" | "proteína" | "pescado",
    ingredients: "",
    steps: "",
    weekDay: "",
  });

  // If an initialRecipe is provided for its editing, it will set it in setRecipe
  useEffect(() => {
    if (initialRecipe) {
      setRecipe(initialRecipe);
    }
  }, [initialRecipe]);

  const handleSave = async () => {
    console.log("Datos de la receta antes de guardar:", recipe);

    if (isEditing && onEdit) {
      console.log("Editando receta:", recipe);
      onEdit(recipe);
    } else if (!isEditing && onSave) {
      console.log("Añadiendo nueva receta:", recipe);
      onSave(recipe);
    }
    onClose();
  };

  const [typeMenuVisible, setTypeMenuVisible] = React.useState(false);

  // Function that handles selecting a recipe type from the menu
  const handleTypeSelect = (
    type: "hidratos" | "fibra" | "proteína" | "pescado"
  ) => {
    setRecipe((prevState) => ({
      ...prevState,
      label: type,
    }));
    setTypeMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>Nombre</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Inserte nombre..."
        value={recipe.name}
        onChangeText={(text) =>
          setRecipe((prevState) => ({ ...prevState, name: text }))
        }
      />
      <Text>Descripción</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Inserte descripción..."
        value={recipe.description}
        onChangeText={(text) =>
          setRecipe((prevState) => ({ ...prevState, description: text }))
        }
      />
      <Text>Tipo</Text>
      <Menu
        visible={typeMenuVisible}
        onDismiss={() => setTypeMenuVisible(false)}
        anchor={
          <Pressable
            style={styles.inputs}
            onPress={() => setTypeMenuVisible(true)}
          >
            <Text>{recipe.label ? recipe.label : "Seleccionar tipo"}</Text>
          </Pressable>
        }
      >
        <Menu.Item
          onPress={() => handleTypeSelect("proteína")}
          title="Proteína"
        />
        <Menu.Item
          onPress={() => handleTypeSelect("pescado")}
          title="Pescado"
        />
        <Menu.Item onPress={() => handleTypeSelect("fibra")} title="Fibra" />
        <Menu.Item
          onPress={() => handleTypeSelect("hidratos")}
          title="Hidratos"
        />
      </Menu>

      <Text>Ingredientes</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Inserte ingredientes..."
        value={recipe.ingredients}
        onChangeText={(text) =>
          setRecipe((prevState) => ({ ...prevState, ingredients: text }))
        }
      />

      <Text>Pasos</Text>
      <TextInput
        style={styles.inputs}
        placeholder="Inserte pasos..."
        value={recipe.steps}
        onChangeText={(text) =>
          setRecipe((prevState) => ({ ...prevState, steps: text }))
        }
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text>{isEditing ? "Guardar" : "Añadir"}</Text>
      </Pressable>
    </View>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    margin: 50,
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
  inputs: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});
