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
  background: colors.darkDarkBrown,
  backgroundSVG: colors.darkDarkBrown,
  card: colors.darkLightBrown,
  cardToday: colors.darkLightBrown,
  cardBackground: colors.darkLightBrownVariant,
  cardHeader: colors.darkDarkPurple,
  text: colors.darkCreme,
  textVariant: colors.darkCreme,
  accent: colors.darkLightBrown,
  accentVariant: colors.darkEvenLighterPurple,
  button: colors.darkEvenLighterPurple,
  error: colors.red,
  textPressable: colors.darkEvenLighterPurple,
  border: colors.darkCreme,
  icon: colors.darkCreme,
  iconVariant: colors.darkCreme,
};

export const useColors = () => {
  const { theme } = useContext(UserContext);
  return theme === "dark" ? dark : light;
};
