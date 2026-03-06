import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { MenuRecipe, Recipe } from "../types/recipeType";
import { Modal, Portal, Provider, Searchbar } from "react-native-paper";
import { navigate } from "../navigation/NavigationContainer";
import {
  updateRecipe,
  createMenu,
  getLastMenu,
} from "../services/db/database.service";
import MenuGenerator from "../components/MenuGenerator";
import { colors } from "../theme/colors";
import { Entypo, Feather } from "@expo/vector-icons";
import DashedButton from "../components/Core/DashedButton";
import { Trans } from "@lingui/react/macro";

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
    backgroundColor: colors.offWhite,
    padding: 30,
    marginHorizontal: 20,
    borderRadius: 25,
    borderColor: colors.lightBrown,
    borderWidth: 2,
  };

  const cardStyle = editMode ? styles.dayCardEdit : styles.dayCard;

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

  const recipesByDay = daysOfWeekOrder.reduce(
    (acc, day) => {
      const dayRecipes = sortedMenuRecipes.filter((mr) => mr.weekDay === day);
      if (dayRecipes.length > 0) {
        acc[day] = dayRecipes;
      }
      return acc;
    },
    {} as Record<string, MenuRecipe[]>,
  );

  return (
    <Provider>
      <View style={styles.container}>
        {currentMenu && currentMenu.recipes.length > 0 ? (
          <View style={styles.buttonGroup}>
            <Pressable
              style={styles.menuGeneratorButton}
              onPress={showMenuGeneratorModal}
            >
              <Entypo name="plus" size={24} color={colors.lightBrown} />
            </Pressable>
            <Pressable style={styles.editMenu} onPress={toggleEditMode}>
              {editMode ? (
                <Feather
                  name="check-circle"
                  size={24}
                  color={colors.lightBrown}
                />
              ) : (
                <Feather name="edit-3" size={24} color={colors.lightBrown} />
              )}
            </Pressable>
          </View>
        ) : (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text style={styles.infoText}>
              <Trans>No menu available!</Trans>
            </Text>

            <DashedButton
              title="Crear menú"
              color={colors.purple}
              style={{ marginTop: 20 }}
              background={colors.transparentYellow}
              onPress={showMenuGeneratorModal}
            />
          </View>
        )}

        {sortedMenuRecipes.length > 0 && (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 30 }}
          >
            {Object.entries(recipesByDay).map(([day, recipes]) => (
              <View key={day} style={cardStyle}>
                <View style={styles.weekDayContainer}>
                  <Text style={styles.weekDay}>{day}</Text>
                </View>

                {recipes.map((mr) => (
                  <Pressable
                    key={mr.mealType.id}
                    style={styles.recipeCard}
                    onPress={() =>
                      editMode ? showSearchModal(mr) : handleDetails(mr.recipe)
                    }
                  >
                    <Text style={styles.mealType}>{mr.mealType.name}</Text>
                    <Text style={styles.recipeName}>{mr.recipe.name}</Text>
                  </Pressable>
                ))}
              </View>
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
            style={{
              borderColor: colors.lightBrown,
              borderWidth: 2,
            }}
            inputStyle={{
              color: colors.darkBrown,
              fontFamily: "ShantellSans-Regular",
            }}
            theme={{
              colors: {
                onSurface: colors.lightBrown,
                onSurfaceVariant: colors.lightBrown,
              },
            }}
          />
          <ScrollView>
            {filteredRecipes.map((recipe, index) => (
              <Pressable key={index} onPress={() => handleRecipeChange(recipe)}>
                <View style={styles.recipeCard}>
                  <Text
                    style={{
                      color: colors.lightBrown,
                      fontFamily: "ShantellSans-Regular",
                    }}
                  >
                    {recipe.name}
                  </Text>
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
    paddingTop: 15,
    backgroundColor: colors.transparentYellow,
  },
  dayCard: {
    borderColor: colors.lightBrown,
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: colors.offWhite,
    paddingBottom: 10,
  },
  dayCardEdit: {
    borderColor: colors.lightBrown,
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: colors.offWhite,
    paddingBottom: 10,
    elevation: 10,
  },
  recipeCard: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  weekDayContainer: {
    backgroundColor: colors.pink,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomColor: colors.lightBrown,
    borderBottomWidth: 2,
    marginBottom: 10,
  },

  weekDay: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
  },
  mealType: {
    fontSize: 13,
    color: colors.lightBrown,
    marginBottom: 4,
    fontFamily: "ShantellSans-Regular",
  },
  recipeName: {
    fontSize: 16,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
  },
  menuGeneratorButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.orange,
    borderColor: colors.lightBrown,
    borderWidth: 2,
  },
  editMenu: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.orange,
    borderColor: colors.lightBrown,
    borderWidth: 2,
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
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
  infoText: {
    fontSize: 18,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.red,
  },
});
