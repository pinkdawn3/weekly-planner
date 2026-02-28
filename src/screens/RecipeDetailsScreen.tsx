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
  getLastMenu,
} from "../services/database.service";

import { RootStackParamList } from "../navigation/RootNavigator";

type RecipeDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "RecipeDetailsScreen"
>;
type RecipeDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeDetailsScreen"
>;

//Screen with the logic for navigating to this screen from other parts of the application, and also handles the logic of editing,
//deleting recipes, and calling for the RecipeDetails component.
const RecipeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();
  const route = useRoute<RecipeDetailsScreenRouteProp>();

  const { recipe } = route.params;

  const { setRecipes, setCurrentMenu } = useContext(RecipeContext);

  const [editRecipeVisible, setEditRecipeVisible] = useState(false);

  const showEditModal = () => setEditRecipeVisible(true);
  const hideEditModal = () => setEditRecipeVisible(false);

  const handleEdit = (selectedRecipe: Recipe) => {
    try {
      updateRecipe(selectedRecipe);
      setRecipes(getAllRecipes());
      const updatedMenu = getLastMenu();
      setCurrentMenu(updatedMenu ?? { id: 0, created: "", recipes: [] });
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
