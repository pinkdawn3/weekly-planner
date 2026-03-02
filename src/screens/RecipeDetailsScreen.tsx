import React, { useContext, useRef, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Recipe } from "../types/RecipeType";
import {
  Pressable,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { RecipeContext } from "../contexts/RecipeContext";
import {
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
  getLastMenu,
} from "../services/database.service";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Chip } from "react-native-paper";

type RecipeDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecipeDetailsScreen"
>;
type RecipeDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeDetailsScreen"
>;

type RecipeFields = {
  name: string;
  description: string;
  ingredients: string;
  steps: string;
};

interface EditableFieldProps {
  field: keyof RecipeFields;
  fieldsRef: React.RefObject<RecipeFields>;
  onSave: (field: keyof RecipeFields, value: string) => void;
  placeholder: string;
  style?: any;
}

const EditableField = ({
  field,
  fieldsRef,
  onSave,
  placeholder,
  style,
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(fieldsRef.current[field] ?? "");

  if (editing) {
    return (
      <TextInput
        value={text}
        onChangeText={setText}
        onBlur={() => {
          if (text.trim().length > 0) {
            fieldsRef.current[field] = text;
            onSave(field, text);
            setEditing(false);
          }
        }}
        autoFocus
        multiline
        style={[
          style,
          {
            borderWidth: 0,
            padding: 0,
            minHeight: 100,
            textAlignVertical: "top",
          },
        ]}
      />
    );
  }

  if (!text) {
    return (
      <Pressable onPress={() => setEditing(true)}>
        <Text>+ {placeholder}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={() => setEditing(true)}>
      <Text style={style}>{text}</Text>
    </Pressable>
  );
};

const RecipeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();
  const route = useRoute<RecipeDetailsScreenRouteProp>();
  const { setRecipes, setCurrentMenu } = useContext(RecipeContext);

  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(
    route.params.recipe,
  );

  const fieldsRef = useRef<RecipeFields>({
    name: route.params.recipe.name ?? "",
    description: route.params.recipe.description ?? "",
    ingredients: route.params.recipe.ingredients ?? "",
    steps: route.params.recipe.steps ?? "",
  });

  const handleFieldSave = (field: keyof RecipeFields, value: string) => {
    const updated = { ...currentRecipe, [field]: value };
    setCurrentRecipe(updated);
    try {
      updateRecipe(updated);
      setRecipes(getAllRecipes());
      const updatedMenu = getLastMenu();
      setCurrentMenu(updatedMenu ?? { id: 0, created: "", recipes: [] });
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleDelete = () => {
    if (currentRecipe.id !== undefined) {
      try {
        deleteRecipe(currentRecipe.id);
        setRecipes(getAllRecipes());
        navigation.goBack();
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.darkBrown} />
          <Text style={styles.buttonText}>Volver</Text>
        </Pressable>
        <Pressable style={styles.buttonDelete} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color={colors.darkBrown} />
        </Pressable>
      </View>

      <SafeAreaView style={styles.detailsContainer}>
        <EditableField
          field="name"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Nombre"
          style={styles.modalTitle}
        />

        <EditableField
          field="description"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Descripción"
          style={styles.modalDescription}
        />

        <Text style={styles.modalSectionTitle}>Tipo de comida</Text>
        <View style={styles.chipContainer}>
          {currentRecipe.mealTypes.map((mt) => (
            <Chip key={mt.id} style={styles.chip}>
              {mt.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.modalSectionTitle}>Categoría</Text>
        <View style={styles.chipContainer}>
          {currentRecipe.labels.map((l) => (
            <Chip key={l.id} style={styles.chip}>
              {l.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.modalSectionTitle}>Ingredientes</Text>
        <EditableField
          field="ingredients"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Ingredientes"
          style={styles.modalText}
        />

        <Text style={styles.modalSectionTitle}>Pasos</Text>
        <EditableField
          field="steps"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Pasos"
          style={styles.modalText}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonDelete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f28966",
  },
  buttonText: {
    marginLeft: 5,
    color: "black",
  },
  backButton: {
    flexDirection: "row",
  },
  detailsContainer: {
    alignItems: "center",
    backgroundColor: colors.offWhite,
  },
  modalTitle: {
    fontSize: 24,
    color: "#333",
    marginVertical: 10,
    fontFamily: "ShantellSans-Bold",
  },
  modalDescription: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    fontFamily: "ShantellSans-Regular",
  },
  modalSectionTitle: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
    fontFamily: "ShantellSans-SemiBold",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "ShantellSans-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
});
