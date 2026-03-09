import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import TodayRecipe from "../components/Recipes/TodayRecipe";
import { useContext, useEffect } from "react";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { getLastMenu } from "../services/db/database.service";
import { Menu } from "../types/recipeType";
import { colors } from "../theme/colors";
import SquareBackground from "../components/Core/SquareBackground";

const menuDefault: Menu = { id: 0, created: "", recipes: [], structure: [] };

const Homescreen = () => {
  const { setCurrentMenu, menuCreated, setMenuCreated } =
    useContext(RecipeContext);

  useEffect(() => {
    try {
      const menuData = getLastMenu();
      setCurrentMenu(menuData ?? menuDefault);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (menuCreated) {
      try {
        const menuData = getLastMenu();
        setCurrentMenu(menuData ?? menuDefault);
      } catch (error) {
        console.log(error);
      } finally {
        setMenuCreated(false);
      }
    }
  }, [menuCreated]);

  return (
    <View style={styles.container}>
      <SquareBackground />
      <TodayRecipe />
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
