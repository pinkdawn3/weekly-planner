import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { RecipeContext } from "../../contexts/RecipeContext";
import { Recipe } from "../../types/RecipeType";
import { navigate } from "../../navigation/NavigationContainer";

const TodayRecipe = () => {
  const { currentMenu } = useContext(RecipeContext);
  const [todaysRecipe, setTodaysRecipe] = useState<Recipe | null>(null);

  const currentDate = moment().format("dddd"); //Current day

  //Load the current menu and compare the weekDay attribute to the currentDay. When it finds it, sets it on the todayRecipe state.
  useEffect(() => {
    if (currentMenu && currentMenu.recipes && currentMenu.recipes.length > 0) {
      const todayRecipe = currentMenu.recipes.find(
        (recipe) => recipe.weekDay === currentDate
      );
      setTodaysRecipe(todayRecipe || null);
    }
  }, [currentMenu]);

  //Function that navigates towards the screen that shows the details of today's recipe
  const handlePress = () => {
    if (todaysRecipe) {
      navigate("RecipeDetailsScreen", { recipe: todaysRecipe });
    }
  };

  return (
    <View style={styles.card}>
      {todaysRecipe ? (
        <>
          <Pressable onPress={handlePress}>
            <Text style={styles.title}>Receta de Hoy</Text>
            <Text style={styles.recipeName}>{todaysRecipe.name}</Text>
            <Text style={styles.recipeDescription}>
              {todaysRecipe.description}
            </Text>
            <Text style={styles.recipeLabel}>{todaysRecipe.label}</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.noMenuText}>No se ha generado menú</Text>
      )}
    </View>
  );
};

export default TodayRecipe;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    height: height / 3, // Occupies at most one third of the screen height
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20, // Margin to separate from buttons below
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  recipeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  recipeLabel: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  noMenuText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
