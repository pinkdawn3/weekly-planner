import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import BottomTabNav from "./BottomTabNav";

import { UserInfoContext } from "../contexts/UserInfoContext";
import RecipeDetails from "../components/Recipes/RecipeDetails";
import { Recipe } from "../types/RecipeType";
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

//This is the Stack that is the heart of the Application. It's the Stack that will appear when the user opens the app, and it will
//take them either to the Autentification section, or the actual App if they log-in.
const AuthHomepage = () => {
  const { isLogged } = useContext(UserInfoContext);

  return (
    <Stack.Navigator
      initialRouteName={isLogged ? "BottomTabNav" : "AuthStack"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen
        name="RecipeDetailsScreen"
        component={RecipeDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthHomepage;
