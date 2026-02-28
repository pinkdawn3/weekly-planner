import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import TodayRecipe from "../components/Recipes/TodayRecipe";

const Homescreen = () => {
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
            {/* <Rect width="20" height="20" fill="#e5e5f7" /> */}
            {/* Línea horizontal */}
            <Line
              x1="0"
              y1="0"
              x2="25"
              y2="0"
              stroke="#ffd9cc"
              strokeWidth="2"
            />
            {/* Línea vertical */}
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="25"
              stroke="#ffd9cc"
              strokeWidth="2"
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
