import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/RecipeContext";
import { Modal, PaperProvider, Portal, Searchbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AddRecipe from "../components/Recipes/AddRecipe";
import { Recipe } from "../types/RecipeType";
import { navigate } from "../navigation/NavigationContainer";
import RecipeService from "../services/recipes.service";
import { UserInfoContext } from "../contexts/UserInfoContext";

const Recipes = () => {
  const { recipes, setRecipes } = useContext(RecipeContext);
  const { currentUser } = useContext(UserInfoContext);

  // States that manage the selected recipe, the text to search and the visibility of the modals
  const [addRecipeVisible, setAddRecipeVisible] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchText, setSearchText] = useState("");

  // Functions to show and hide the "AddRecipe" modal
  const showAddModal = () => setAddRecipeVisible(true);
  const hideAddModal = () => setAddRecipeVisible(false);

  // Functions to show and hide the "RecipeDetails" modal
  const showDetailsScreen = (recipe: Recipe) => {
    navigate("RecipeDetailsScreen", { recipe });
  };

  const containerStyle = { backgroundColor: "white", margin: 40 };

  // Function that filters the recipes based on the input text
  const searchRecipe = () => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleSaveRecipe = async (newRecipe: Recipe) => {
    try {
      await RecipeService.createRecipe(newRecipe, currentUser.id);
      const retrievedRecipes = await RecipeService.getAllRecipes(
        currentUser.id
      );
      setRecipes(retrievedRecipes);
     
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const filteredRecipes = searchRecipe();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Portal>
          {/* Modal for adding or editing a recipe */}
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

        {/* Search bar to search recipes by name */}
        <Searchbar
          placeholder="Busque el nombre de una receta..."
          onChangeText={setSearchText}
          value={searchText}
        />

        {/* Floating button to show the add recipe modal */}
        <Pressable
          style={styles.floatingButtonContainer}
          onPress={() => {
            setSelectedRecipe(null);
            showAddModal();
          }}
        >
          <Ionicons name="add-outline" size={20} color="white" />
        </Pressable>

        {/* Scroll view to display filtered recipes */}
        <ScrollView>
          {filteredRecipes &&
            filteredRecipes.map((recipe, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.title}>{recipe.name}</Text>
                <Text style={styles.description}>{recipe.description}</Text>
                <Pressable onPress={() => showDetailsScreen(recipe)}>
                  <Text style={styles.detailsLink}>Ver detalles</Text>
                </Pressable>
              </View>
            ))}
        </ScrollView>

        {/* Modal for recipe details with options to edit or delete */}
      </View>
    </PaperProvider>
  );
};

export default Recipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    padding: 15,
    backgroundColor: "#f28966",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  detailsLink: {
    color: "green",
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: "white",
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
});
