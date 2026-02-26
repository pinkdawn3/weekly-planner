import "react-native-gesture-handler";

import { PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import React from "react";
import Header from "./src/header/Header";
import RecipeProvider from "./src/providers/RecipeProvider";

import AppNavigationContainer from "./src/navigation/NavigationContainer";
import BottomTabNav from "./src/navigation/BottomTabNav";

// Main App of the application, with all the Providers and the custom NavigationContainer
export default function App() {
  return (
    <AppNavigationContainer>
      <RecipeProvider>
        <PaperProvider>
          <Header />
          <BottomTabNav />
        </PaperProvider>
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
