import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import TodayRecipe from "../components/Recipes/TodayRecipe";
import { useContext, useEffect } from "react";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { getLastMenu } from "../services/db/database.service";
import { Menu } from "../types/recipeType";
import { colors } from "../theme/colors";

const menuDefault: Menu = { id: 0, created: "", recipes: [] };

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
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="grid"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            {/* Fondo del patrón */}
            <Rect width="25" height="25" fill={colors.yellow} />
            {/* Línea horizontal */}
            <Line
              x1="0"
              y1="0"
              x2="25"
              y2="0"
              stroke="#ffcea3"
              strokeWidth="2.5"
            />
            {/* Línea vertical */}
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="25"
              stroke="#ffcea3"
              strokeWidth="2.5"
            />
          </Pattern>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#grid)" opacity={0.8} />
      </Svg>
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
