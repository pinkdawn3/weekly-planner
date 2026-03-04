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
} from "../services/db/database.service";
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
          { borderWidth: 0, padding: 0, textAlignVertical: "top" },
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

interface EditableArrayItemProps {
  value: string;
  onSave: (value: string) => void;
  onDelete: () => void;
  style?: any;
}

const EditableArrayItem = ({
  value,
  onSave,
  onDelete,
  style,
}: EditableArrayItemProps) => {
  const [editing, setEditing] = useState(!value);
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);

  if (editing) {
    return (
      <View style={styles.arrayItemContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (text.trim().length > 0) {
              onSave(text);
              setEditing(false);
              setFocused(false);
            } else {
              setTimeout(() => onDelete(), 0);
            }
          }}
          autoFocus
          style={[
            style,
            { flex: 1, borderWidth: 0, padding: 0 },
            focused && styles.inputFocused,
          ]}
        />
        <Pressable onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color={colors.darkOrange} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.arrayItemContainer}>
      <Pressable style={{ flex: 1 }} onPress={() => setEditing(true)}>
        <Text style={style}>{text}</Text>
      </Pressable>
      <Pressable onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color={colors.darkOrange} />
      </Pressable>
    </View>
  );
};

const RecipeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();
  const route = useRoute<RecipeDetailsScreenRouteProp>();
  const { setRecipes, setCurrentMenu } = useContext(RecipeContext);

  const [currentRecipe, setCurrentRecipe] = useState<Recipe>({
    ...route.params.recipe,
    ingredients: route.params.recipe.ingredients ?? [],
    steps: route.params.recipe.steps ?? [],
  });

  const fieldsRef = useRef<RecipeFields>({
    name: route.params.recipe.name ?? "",
    description: route.params.recipe.description ?? "",
  });

  const handleSave = (field: keyof Recipe, value: any) => {
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
          onSave={(field, value) => handleSave(field, value)}
          placeholder="Nombre"
          style={styles.modalTitle}
        />

        <EditableField
          field="description"
          fieldsRef={fieldsRef}
          onSave={(field, value) => handleSave(field, value)}
          placeholder="Añadir descripción"
          style={styles.detailsText}
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
        {currentRecipe.ingredients.map((ingredient, index) => (
          <EditableArrayItem
            key={index}
            value={ingredient}
            onSave={(value) => {
              const newArray = [...currentRecipe.ingredients];
              newArray[index] = value;
              handleSave("ingredients", newArray);
            }}
            onDelete={() =>
              handleSave(
                "ingredients",
                currentRecipe.ingredients.filter((_, i) => i !== index),
              )
            }
            style={styles.detailsText}
          />
        ))}
        <Pressable
          onPress={() =>
            handleSave("ingredients", [...currentRecipe.ingredients, ""])
          }
        >
          <Text style={styles.addButton}>+ Añadir ingrediente</Text>
        </Pressable>

        <Text style={styles.sectionHeader}>Pasos</Text>
        {currentRecipe.steps.map((step, index) => (
          <EditableArrayItem
            key={index}
            value={step}
            onSave={(value) => {
              const newArray = [...currentRecipe.steps];
              newArray[index] = value;
              handleSave("steps", newArray);
            }}
            onDelete={() =>
              handleSave(
                "steps",
                currentRecipe.steps.filter((_, i) => i !== index),
              )
            }
            style={styles.detailsText}
          />
        ))}
        <Pressable
          onPress={() => handleSave("steps", [...currentRecipe.steps, ""])}
        >
          <Text style={styles.addButton}>+ Añadir paso</Text>
        </Pressable>
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
  arrayItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  addButton: {
    color: colors.orange,
    fontFamily: "ShantellSans-Regular",
    marginVertical: 8,
  },
});
