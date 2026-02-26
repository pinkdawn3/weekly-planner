import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/RecipeContext";
import { MenuRecipe, Recipe } from "../types/RecipeType";
import { Modal, Portal, Provider, Searchbar } from "react-native-paper";
import { navigate } from "../navigation/NavigationContainer";
import {
  updateRecipe,
  createMenu,
  getLastMenu,
} from "../services/database.service";
import MenuGenerator from "../components/MenuGenerator";

const daysOfWeekOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeeklyMenu = () => {
  const { currentMenu, recipes, setCurrentMenu, setMenuCreated } =
    useContext(RecipeContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedMenuRecipe, setSelectedMenuRecipe] =
    useState<MenuRecipe | null>(null);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [MenuGeneratorVisible, setMenuGeneratorVisible] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  const showSearchModal = (menuRecipe: MenuRecipe) => {
    setSelectedMenuRecipe(menuRecipe);
    setSearchVisible(true);
  };

  const hideSearchModal = () => setSearchVisible(false);
  const hideMenuGeneratorModal = () => setMenuGeneratorVisible(false);
  const showMenuGeneratorModal = () => setMenuGeneratorVisible(true);

  const containerStyle = {
    backgroundColor: "white",
    padding: 30,
    margin: 20,
    borderRadius: 10,
  };

  const handleRecipeChange = (newRecipe: Recipe) => {
    if (selectedMenuRecipe && currentMenu && currentMenu.recipes) {
      const updatedMenuRecipes: MenuRecipe[] = currentMenu.recipes.map((mr) =>
        mr.recipe.id === selectedMenuRecipe.recipe.id &&
        mr.mealType.id === selectedMenuRecipe.mealType.id
          ? { ...mr, recipe: newRecipe }
          : mr,
      );

      try {
        updateRecipe(newRecipe);
        createMenu(updatedMenuRecipes);
        const lastMenu = getLastMenu();
        setCurrentMenu(lastMenu ?? { id: 0, created: "", recipes: [] });
        setMenuCreated(true);
      } catch (error) {
        console.error("Error creating menu:", error);
      }

      hideSearchModal();
    }
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const searchRecipe = () =>
    recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchText.toLowerCase()),
    );

  const filteredRecipes = searchRecipe();

  const sortedMenuRecipes = currentMenu?.recipes
    ? [...currentMenu.recipes].sort(
        (a, b) =>
          daysOfWeekOrder.indexOf(a.weekDay) -
          daysOfWeekOrder.indexOf(b.weekDay),
      )
    : [];

  const handleDetails = (recipe: Recipe) => {
    navigate("RecipeDetailsScreen", { recipe });
  };

  return (
    <Provider>
      <View style={styles.container}>
        {recipes.length < 7 ? (
          <>
            <Text style={styles.infoText}>
              Añade al menos 7 recetas para crear un menú semanal.
            </Text>
            <Pressable
              style={[styles.MenuGeneratorButton, styles.disabledButton]}
              disabled
            >
              <Text style={styles.buttonText}>Menú nuevo</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.buttonGroup}>
            <Pressable style={styles.editMenu} onPress={toggleEditMode}>
              <Text style={styles.buttonText}>
                {editMode ? "Dejar de editar" : "Editar menú"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.MenuGeneratorButton}
              onPress={showMenuGeneratorModal}
            >
              <Text style={styles.buttonText}>Menú nuevo</Text>
            </Pressable>
          </View>
        )}

        {sortedMenuRecipes.length > 0 && (
          <ScrollView style={{ width: "100%" }}>
            {sortedMenuRecipes.map((mr, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  editMode ? showSearchModal(mr) : handleDetails(mr.recipe)
                }
              >
                <View style={styles.card}>
                  <Text style={styles.weekDay}>{mr.weekDay}</Text>
                  <Text style={styles.mealType}>{mr.mealType.name}</Text>
                  <Text style={styles.recipeName}>{mr.recipe.name}</Text>
                  <Text style={styles.recipeLabel}>
                    {mr.recipe.labels.map((l) => l.name).join(", ")}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <Portal>
        <Modal
          visible={searchVisible}
          onDismiss={hideSearchModal}
          contentContainerStyle={containerStyle}
          style={{ margin: 40 }}
        >
          <Searchbar
            placeholder="Buscar..."
            onChangeText={setSearchText}
            value={searchText}
          />
          <ScrollView>
            {filteredRecipes.map((recipe, index) => (
              <Pressable key={index} onPress={() => handleRecipeChange(recipe)}>
                <View style={styles.recipeCard}>
                  <Text>{recipe.name}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={MenuGeneratorVisible}
          onDismiss={hideMenuGeneratorModal}
          contentContainerStyle={containerStyle}
        >
          <MenuGenerator onCloseModal={hideMenuGeneratorModal} />
        </Modal>
      </Portal>
    </Provider>
  );
};

export default WeeklyMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  card: {
    width: "90%",
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f8d7d2",
    borderColor: "gray",
    borderWidth: 1,
  },
  weekDay: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  mealType: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  recipeLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  recipeCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  MenuGeneratorButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  editMenu: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
  },
});
