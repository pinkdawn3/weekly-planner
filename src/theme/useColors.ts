// theme/useColors.ts
import { useContext } from "react";
import { UserContext } from "../contexts/User/UserContext";

const colors = {
  // light theme
  orange: "#fecea0",
  darkOrange: "#f28966",
  yellowOld: "#ffe7b7",
  yellow: "#ffebc6",
  transparentYellow: "rgba(255, 231, 183, 0.8)",
  pink: "#ffe2dc",
  lightBrown: "#91726b",
  mediumBrown: "#97746b",
  darkBrown: "#624946",
  offWhite: "#faeeee",
  purple: "#d6b3f5",
  red: "#fc623f",

  //  dark theme
  darkLightBrown: "#523a22",
  darkLightBrownVariant: "##40332d",
  darkCreme: "#ffeecc",
  darkDarkBrown: "#30211a",
  darkEvenLighterPurple: "#bda5c5",
  darkLightPurple: "#6f445f",
  darkDarkPurple: "#6f445f",
};

const light = {
  background: colors.yellow,
  backgroundSVG: colors.yellow,
  cardToday: colors.pink,
  cardBackground: colors.offWhite,
  cardHeader: colors.pink,
  text: colors.darkBrown,
  textVariant: colors.lightBrown,
  accent: colors.orange,
  accentVariant: colors.darkOrange,
  button: colors.purple,
  error: colors.red,
  textPressable: colors.darkOrange,
  border: colors.lightBrown,
  icon: colors.lightBrown,
  iconVariant: colors.mediumBrown,
};

const dark = {
  background: "#31211B",
  backgroundSVG: "#31211B",
  card: colors.darkLightBrown,
  cardToday: "#40332D",
  cardBackground: "#40332D",
  cardHeader: "#42323C",
  text: "#F4E3C1",
  textVariant: "#A69980",
  accent: "#523921",
  accentVariant: "#5B453C",
  button: " #6E445F",
  error: "#5A3124",
  textPressable: "#BF9CD6",
  border: "#A69980",
  icon: "#A69980",
  iconVariant: "#F4E3C1",
};

export const useColors = () => {
  const { theme } = useContext(UserContext);
  return theme === "dark" ? dark : light;
};
