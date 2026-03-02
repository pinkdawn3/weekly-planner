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
  const [focused, setFocused] = useState(false);

  if (editing) {
    return (
      <TextInput
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          if (text.trim().length > 0) {
            fieldsRef.current[field] = text;
            onSave(field, text);
            setEditing(false);
            setFocused(false);
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
          focused && styles.inputFocused,
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
    <ScrollView style={{ backgroundColor: colors.offWhite }}>
      <SafeAreaView style={styles.detailsContainer}>
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

        <EditableField
          field="name"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Nombre"
          style={styles.modalTitle}
        />

        <Text style={styles.sectionHeader}>Tipo de comida</Text>
        <View style={styles.chipContainer}>
          {currentRecipe.mealTypes.map((mt) => (
            <Chip key={mt.id} style={styles.chip}>
              {mt.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Categoría</Text>
        <View style={styles.chipContainer}>
          {currentRecipe.labels.map((l) => (
            <Chip key={l.id} style={styles.chip}>
              {l.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Ingredientes</Text>
        <EditableField
          field="ingredients"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Ingredientes"
          style={styles.detailsText}
        />

        <Text style={styles.sectionHeader}>Pasos</Text>
        <EditableField
          field="steps"
          fieldsRef={fieldsRef}
          onSave={handleFieldSave}
          placeholder="Pasos"
          style={styles.detailsText}
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
    alignItems: "center",
    width: "100%",
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
    marginHorizontal: 20,
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
  sectionHeader: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
    fontFamily: "ShantellSans-SemiBold",
  },
  detailsText: {
    fontSize: 16,
    color: colors.darkBrown,
    textAlign: "left",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
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
  inputFocused: {
    borderWidth: 1,
    borderColor: colors.darkOrange,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
});
