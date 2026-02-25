import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import NewMenu from "../components/NewMenu";
import TodayRecipe from "../components/Recipes/TodayRecipe";
import AddRecipe from "../components/Recipes/AddRecipe";
import { RecipeContext } from "../contexts/RecipeContext";
import RecipeService from "../services/recipes.service";
import MenuService from "../services/menu.service";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { Menu, Recipe } from "../types/RecipeType";

const Homescreen = () => {
  const { recipes, setRecipes, setCurrentMenu, menuCreated, setMenuCreated } =
    useContext(RecipeContext);
  const { currentUser } = useContext(UserInfoContext);
  const [menuVisible, setMenuVisible] = useState(false); // State to control the visibility of the menu modal
  const [recipeVisible, setRecipeVisible] = useState(false); // State to control the visibility of the add recipe modal

  // Functions to show and hide the menu modal
  const showMenuModal = () => setMenuVisible(true);
  const hideMenuModal = () => setMenuVisible(false);

  // Functions to show and hide the add recipe modal
  const showRecipeModal = () => setRecipeVisible(true);
  const hideRecipeModal = () => setRecipeVisible(false);

  // Style for the modals
  const containerStyle = {
    backgroundColor: "white",
    padding: 30,
    margin: 20,
    borderRadius: 10,
  };

  // useEffect that will retrieve the recipes from the API when the component mounts
  useEffect(() => {
    async function retrieveData() {
      if (!currentUser) {
        return;
      }

      try {
        const recipeData = await RecipeService.getAllRecipes(currentUser.id);
        setRecipes(recipeData);

        const menuData: Menu = await MenuService.getLastMenu(currentUser.id);
        setCurrentMenu(menuData);

        console.log("Datos obtenidos correctamente");
      } catch (error) {
        setRecipes([]);
        setCurrentMenu(undefined);

        console.log(error);
      } finally {
      }
    }

    retrieveData();
  }, [currentUser, setRecipes, setCurrentMenu]);

  useEffect(() => {
    if (menuCreated) {
      async function retrieveData() {
        try {
          const menuData: Menu = await MenuService.getLastMenu(currentUser.id);
          setCurrentMenu(menuData);
        } catch (error) {
          console.log(error);
        } finally {
          setMenuCreated(false); // Resetear el estado
        }
      }
      retrieveData();
    }
  }, [menuCreated, setMenuCreated, currentUser.id]);

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
  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Today's Recipe*/}
        <TodayRecipe key={currentUser.id} />
        <View>
          <Portal>
            {/* Modal for adding a recipe */}
            <Modal
              visible={recipeVisible}
              onDismiss={hideRecipeModal}
              contentContainerStyle={containerStyle}
            >
              <AddRecipe onClose={hideRecipeModal} onSave={handleSaveRecipe} />
            </Modal>
          </Portal>
          <Pressable style={styles.buttonRecipe} onPress={showRecipeModal}>
            <Text style={styles.buttonText}>Añadir receta</Text>
          </Pressable>
        </View>

        <Portal>
          {/* Modal for creating a new menu */}
          <Modal
            visible={menuVisible}
            onDismiss={hideMenuModal}
            contentContainerStyle={containerStyle}
          >
            <NewMenu onCloseModal={hideMenuModal} />
          </Modal>
        </Portal>
        {/* Button to create a new menu, disabled if there are less than 7 recipes */}
        <Pressable
          style={[
            styles.newMenuButton,
            recipes.length < 7 && styles.disabledButton,
          ]}
          onPress={recipes.length >= 7 ? showMenuModal : null}
          disabled={recipes.length < 7}
        >
          <Text style={styles.buttonText}>Crear menú nuevo</Text>
        </Pressable>
        {recipes.length < 7 && (
          <Text style={styles.infoText}>
            Añade al menos 7 recetas para crear un menú nuevo.
          </Text>
        )}
      </View>
    </PaperProvider>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRecipe: {
    backgroundColor: "#dbeed0",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
    borderColor: "gray",
    borderWidth: 1,
  },
  newMenuButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
  },
});
