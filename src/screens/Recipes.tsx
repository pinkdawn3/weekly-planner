import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/RecipeContext";
import { Modal, Portal, Searchbar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import AddRecipe from "../components/Recipes/AddRecipe";
import { Recipe } from "../types/RecipeType";
import { createRecipe, getAllRecipes } from "../services/database.service";
import ManageMealTypes from "../components/MenuSettings/ManageMealTypes";
import ManageLabels from "../components/MenuSettings/ManageLabel";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";

const Recipes = () => {
  const { recipes, setRecipes, mealTypes, setMealTypes, labels, setLabels } =
    useContext(RecipeContext);

  const [mealTypesVisible, setMealTypesVisible] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(false);

  // States that manage the selected recipe, the text to search and the visibility of the modals
  const [addRecipeVisible, setAddRecipeVisible] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchText, setSearchText] = useState("");

  // Functions to show and hide the "AddRecipe" modal
  const showAddModal = () => setAddRecipeVisible(true);
  const hideAddModal = () => setAddRecipeVisible(false);

  // Functions to show and hide the "RecipeDetails" modal
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const showDetailsScreen = (recipe: Recipe) => {
    navigation.navigate("RecipeDetailsScreen", { recipe });
  };

  const containerStyle = { backgroundColor: "white", margin: 40, padding: 20 };

  // Function that filters the recipes based on the input text
  const searchRecipe = () => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  const handleSaveRecipe = (newRecipe: Recipe) => {
    try {
      createRecipe(newRecipe);
      const retrievedRecipes = getAllRecipes();
      setRecipes(retrievedRecipes);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const filteredRecipes = searchRecipe();

  return (
    <View style={styles.container}>
      <Portal>
        {/* Modal for adding or editing a recipe */}
        <Modal
          visible={mealTypesVisible}
          onDismiss={() => setMealTypesVisible(false)}
          contentContainerStyle={containerStyle}
        >
          <ManageMealTypes mealTypes={mealTypes} onUpdate={setMealTypes} />
        </Modal>

        <Modal
          visible={labelsVisible}
          onDismiss={() => setLabelsVisible(false)}
          contentContainerStyle={containerStyle}
        >
          <ManageLabels labels={labels} onUpdate={setLabels} />
        </Modal>

        <Modal
          visible={addRecipeVisible}
          onDismiss={hideAddModal}
          contentContainerStyle={containerStyle}
        >
          <AddRecipe
            initialRecipe={selectedRecipe}
            onClose={hideAddModal}
            onSave={handleSaveRecipe}
          />
        </Modal>
      </Portal>

      <View style={styles.configButtons}>
        <Pressable
          style={styles.configButton}
          onPress={() => setMealTypesVisible(true)}
        >
          <Text style={styles.configButtonText}>Tipos de comida</Text>
        </Pressable>
        <Pressable
          style={styles.configButton}
          onPress={() => setLabelsVisible(true)}
        >
          <Text style={styles.configButtonText}>Categorías</Text>
        </Pressable>
      </View>

      {/* Search bar to search recipes by name */}
      <Searchbar
        placeholder="Buscar receta..."
        onChangeText={setSearchText}
        value={searchText}
        style={{
          borderWidth: 2,
          borderColor: colors.lightBrown,
          marginBottom: 10,
        }}
        inputStyle={{ color: colors.darkBrown }}
        theme={{
          colors: {
            onSurface: colors.lightBrown,
            onSurfaceVariant: colors.lightBrown,
          },
        }}
      />

      {/* Floating button to show the add recipe modal */}
      <Pressable
        style={styles.floatingButtonContainer}
        onPress={() => {
          setSelectedRecipe(null);
          showAddModal();
        }}
      >
        <Entypo name="plus" size={24} color={colors.darkBrown} />
      </Pressable>

      {/* Scroll view to display filtered recipes */}
      <ScrollView>
        {filteredRecipes &&
          filteredRecipes.map((recipe, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>{recipe.name}</Text>
              <Pressable onPress={() => showDetailsScreen(recipe)}>
                <Text style={styles.detailsLink}>Ver detalles</Text>
              </Pressable>
            </View>
          ))}
      </ScrollView>

      {/* Modal for recipe details with options to edit or delete */}
    </View>
  );
};

export default Recipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.yellow,
  },
  card: {
    width: "100%",
    backgroundColor: colors.offWhite,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.lightBrown,
  },
  title: {
    fontSize: 22,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
    marginBottom: 8,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    padding: 15,
    backgroundColor: colors.darkOrange,
    borderRadius: 50,
    borderColor: colors.lightBrown,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  detailsLink: {
    color: colors.darkOrange,
    fontFamily: "ShantellSans-Regular",
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: colors.offWhite,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsContainer: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  configButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  configButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#dbeed0",
    borderColor: colors.lightBrown,
    borderWidth: 2,
  },
  configButtonText: {
    fontFamily: "ShantellSans-Regular",
    color: colors.darkBrown,
  },
});
