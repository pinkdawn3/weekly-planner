import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { RecipeContext } from "../../contexts/RecipeContext";
import { MenuRecipe } from "../../types/RecipeType";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootNavigator";

import { colors } from "../../theme/colors";

const TodayRecipe = () => {
  const { currentMenu } = useContext(RecipeContext);
  const [todaysRecipes, setTodaysRecipes] = useState<MenuRecipe[]>([]);
  const currentDate = moment().format("dddd");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (currentMenu && currentMenu.recipes && currentMenu.recipes.length > 0) {
      const todayRecipes = currentMenu.recipes.filter(
        (mr) => mr.weekDay === currentDate,
      );
      setTodaysRecipes(todayRecipes);
    }
  }, [currentMenu]);

  const handlePress = (menuRecipe: MenuRecipe) => {
    console.log("handlePress called", menuRecipe.recipe.name);
    navigation.navigate("RecipeDetailsScreen", { recipe: menuRecipe.recipe });
  };

  return (
    <View style={styles.card}>
      {todaysRecipes.length > 0 ? (
        <>
          <Text style={styles.title}>Hoy toca...</Text>

          {todaysRecipes.map((mr) => (
            <Pressable key={mr.mealType.id} onPress={() => handlePress(mr)}>
              <Text style={styles.mealType}>{mr.mealType.name}</Text>
              <Text style={styles.recipeName}>{mr.recipe.name}</Text>
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

const styles = StyleSheet.create({
  card: {
    paddingVertical: 30,
    paddingHorizontal: 50,
    backgroundColor: colors.pink,
    borderRadius: 30,
    borderColor: colors.lightBrown,
    borderWidth: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: colors.darkBrown,
    fontFamily: "ShantellSans-Bold",
    textAlign: "center",
  },
  mealType: {
    fontSize: 14,
    color: colors.lightBrown,
    marginTop: 10,
    fontFamily: "ShantellSans-SemiBoldItalic",
  },
  recipeName: {
    fontSize: 18,
    color: colors.darkBrown,
    marginBottom: 4,
    fontFamily: "ShantellSans-SemiBold",
  },
  noMenuText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
