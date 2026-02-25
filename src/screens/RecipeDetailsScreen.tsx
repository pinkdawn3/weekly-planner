import React, { useContext, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Recipe } from "../types/RecipeType";
import RecipeDetails from "../components/Recipes/RecipeDetails";
import RecipeService from "../services/recipes.service";
import { View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import AddRecipe from "../components/Recipes/AddRecipe";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { RecipeContext } from "../contexts/RecipeContext";

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

  const { currentUser } = useContext(UserInfoContext);
  const { setRecipes } = useContext(RecipeContext);

  const [editRecipeVisible, setEditRecipeVisible] = useState(false);

  const showEditModal = () => setEditRecipeVisible(true);
  const hideEditModal = () => setEditRecipeVisible(false);

  const handleEdit = async (selectedRecipe: Recipe) => {
    console.log(
      "Datos de la receta antes de enviar la solicitud:",
      selectedRecipe
    );
    try {
      await RecipeService.updateRecipe(selectedRecipe);
      const retrievedRecipes = await RecipeService.getAllRecipes(
        currentUser.id
      );
      setRecipes(retrievedRecipes);
      hideEditModal();
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDelete = async () => {
    if (recipe && recipe.id !== undefined) {
      try {
        await RecipeService.deleteRecipe(recipe.id);
        const retrievedRecipes = await RecipeService.getAllRecipes(
          currentUser.id
        );
        setRecipes(retrievedRecipes);
        console.log("Recipe deleted");
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
