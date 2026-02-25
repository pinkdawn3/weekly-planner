import React, { useContext, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Recipe } from "../types/RecipeType";
import RecipeDetails from "../components/Recipes/RecipeDetails";
import { View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import AddRecipe from "../components/Recipes/AddRecipe";
import { RecipeContext } from "../contexts/RecipeContext";
import {
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
} from "../services/database.service";

type RootStackParamList = {
  RecipeDetails: { recipe: Recipe };
};

type RecipeDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeDetails"
>;

type RecipeDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecipeDetails"
>;

//Screen with the logic for navigating to this screen from other parts of the application, and also handles the logic of editing,
//deleting recipes, and calling for the RecipeDetails component.
const RecipeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();
  const route = useRoute<RecipeDetailsScreenRouteProp>();

  const { recipe } = route.params;

  const { setRecipes } = useContext(RecipeContext);

  const [editRecipeVisible, setEditRecipeVisible] = useState(false);

  const showEditModal = () => setEditRecipeVisible(true);
  const hideEditModal = () => setEditRecipeVisible(false);

  const handleEdit = (selectedRecipe: Recipe) => {
    try {
      updateRecipe(selectedRecipe);
      const retrievedRecipes = getAllRecipes();
      setRecipes(retrievedRecipes);
      hideEditModal();
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDelete = () => {
    if (recipe && recipe.id !== undefined) {
      try {
        deleteRecipe(recipe.id);
        const retrievedRecipes = getAllRecipes();
        setRecipes(retrievedRecipes);
        navigation.goBack();
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  const containerStyle = { backgroundColor: "white", margin: 40 };

  return (
    <View>
      <RecipeDetails
        recipe={recipe}
        onEdit={showEditModal}
        onDelete={handleDelete}
      />
      <Portal>
        <Modal
          visible={editRecipeVisible}
          onDismiss={hideEditModal}
          contentContainerStyle={containerStyle}
        >
          <AddRecipe
            initialRecipe={recipe}
            onClose={hideEditModal}
            onEdit={handleEdit}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default RecipeDetailsScreen;
