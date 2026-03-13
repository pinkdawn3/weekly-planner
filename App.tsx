import React, { useContext } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";

import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

import Header from "./src/header/Header";
import RecipeProvider from "./src/contexts/Recipe/RecipeProvider";
import AppNavigationContainer from "./src/navigation/NavigationContainer";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/colors";

import UserProvider from "./src/contexts/User/UserProvider";
import { UserContext } from "./src/contexts/User/UserContext";
import { toastConfig } from "./src/components/Core/ToastConfig";

const AppContent = () => {
  const { theme } = useContext(UserContext);

  const fontConfig = {
    fontFamily: "ShantellSans-Regular",
  };

  const lightTheme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...MD3LightTheme.colors,
      secondaryContainer: "#eab295",
      onSurface: colors.lightBrown, // primary text color
      onSurfaceVariant: colors.lightBrown, // secondary text color
      primary: colors.darkOrange,
      outline: colors.lightBrown,
    },
  };

  const darkTheme = {
    ...MD3DarkTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...MD3DarkTheme.colors,
      secondaryContainer: "#7a4a2a",
      onSurface: colors.offWhite, // primary text color
      onSurfaceVariant: colors.offWhite, // secondary text color
      primary: colors.darkOrange,
      outline: colors.offWhite,
    },
  };

  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = {
    fontFamily: "ShantellSans-Regular",
    color: "#624942",
  };

  return (
    <PaperProvider theme={theme == "light" ? lightTheme : darkTheme}>
      <Header />
      <RootNavigator />
    </PaperProvider>
  );
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
          <UserProvider>
            <RecipeProvider>
              <AppContent />
            </RecipeProvider>
          </UserProvider>
        </AppNavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </View>
  );
}
