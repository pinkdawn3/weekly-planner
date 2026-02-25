import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNav from "./BottomTabNav";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";

export type RootStackParamList = {
  BottomTabNav: undefined;
  AuthStack: undefined;
  ButtonGroup: undefined;
  Login: undefined;
  Signup: undefined;
  RecipeDetailsScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthHomepage = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTabNav"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen
        name="RecipeDetailsScreen"
        component={RecipeDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthHomepage;
