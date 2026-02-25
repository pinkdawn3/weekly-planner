import "react-native-gesture-handler";

import { PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import React from "react";
import Header from "./src/header/Header";
import RecipeProvider from "./src/providers/RecipeProvider";
import AuthHomepage from "./src/navigation/AuthHomepage";
import UserInfoProvider from "./src/providers/UserInfoProvider";
import AppNavigationContainer from "./src/navigation/NavigationContainer";

// Main App of the application, with all the Providers and the custom NavigationContainer
export default function App() {
  return (
    <AppNavigationContainer>
      <RecipeProvider>
        <UserInfoProvider>
          <PaperProvider>
            <Header />
            <AuthHomepage />
          </PaperProvider>
        </UserInfoProvider>
      </RecipeProvider>
    </AppNavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
