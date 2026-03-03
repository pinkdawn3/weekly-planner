import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AddRecipe from "../screens/AddRecipe";
import BottomTabNav from "./BottomTabNav";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";

import { Recipe } from "../types/RecipeType";

export type RootStackParamList = {
  AddRecipe: undefined;
  BottomTabNav: undefined;
  RecipeDetailsScreen: { recipe: Recipe };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTabNav"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddRecipe" component={AddRecipe} />
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />

      <Stack.Screen
        name="RecipeDetailsScreen"
        component={RecipeDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
