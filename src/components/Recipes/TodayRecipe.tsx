import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { RecipeContext } from "../../contexts/RecipeContext";
import { MenuRecipe } from "../../types/RecipeType";
import { navigate } from "../../navigation/NavigationContainer";

const TodayRecipe = () => {
  const { currentMenu } = useContext(RecipeContext);
  const [todaysRecipes, setTodaysRecipes] = useState<MenuRecipe[]>([]);
  const currentDate = moment().format("dddd");

  useEffect(() => {
    if (currentMenu && currentMenu.recipes && currentMenu.recipes.length > 0) {
      const todayRecipes = currentMenu.recipes.filter(
        (mr) => mr.weekDay === currentDate,
      );
      setTodaysRecipes(todayRecipes);
    }
  }, [currentMenu]);

  const handlePress = (menuRecipe: MenuRecipe) => {
    navigate("RecipeDetailsScreen", { recipe: menuRecipe.recipe });
  };

  return (
    <View style={styles.card}>
      {todaysRecipes.length > 0 ? (
        <>
          <Text style={styles.title}>Recetas de Hoy</Text>
          {todaysRecipes.map((mr) => (
            <Pressable key={mr.mealType.id} onPress={() => handlePress(mr)}>
              <Text style={styles.mealType}>{mr.mealType.name}</Text>
              <Text style={styles.recipeName}>{mr.recipe.name}</Text>
              <Text style={styles.recipeDescription}>
                {mr.recipe.description}
              </Text>
            </Pressable>
          ))}
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
    height: height / 3,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  mealType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  noMenuText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
