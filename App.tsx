import "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import React from "react";
import Header from "./src/header/Header";
import RecipeProvider from "./src/providers/RecipeProvider";
import AppNavigationContainer from "./src/navigation/NavigationContainer";
import RootNavigator from "./src/navigation/RootNavigator";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./src/theme/colors";

const fontConfig = {
  fontFamily: "ShantellSans-Regular",
};

const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    secondaryContainer: "#eab295",

    onSurface: "#624942", // primary text color
    onSurfaceVariant: "#666", // secondary text color
  },
};

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = {
  fontFamily: "ShantellSans-Regular",
  color: "#624942",
};

// Main App of the application, with all the Providers and the custom NavigationContainer
export default function App() {
  const [fontsLoaded] = useFonts({
    "ShantellSans-Regular": require("./assets/fonts/static/ShantellSans-Regular.ttf"),
    "ShantellSans-Bold": require("./assets/fonts/static/ShantellSans-Bold.ttf"),
    "ShantellSans-Italic": require("./assets/fonts/static/ShantellSans-Italic.ttf"),
    "ShantellSans-BoldItalic": require("./assets/fonts/static/ShantellSans-BoldItalic.ttf"),
    "ShantellSans-SemiBold": require("./assets/fonts/static/ShantellSans-SemiBold.ttf"),
    "ShantellSans-SemiBoldItalic": require("./assets/fonts/static/ShantellSans-SemiBoldItalic.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.transparentYellow }}>
      <SafeAreaProvider>
        <AppNavigationContainer>
          <RecipeProvider>
            <PaperProvider theme={theme}>
              <Header />
              <RootNavigator />
            </PaperProvider>
          </RecipeProvider>
        </AppNavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}
