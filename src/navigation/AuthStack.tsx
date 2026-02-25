import { StyleSheet, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./AuthHomepage";
import ButtonGroup from "../components/Authentification/ButtonGroup";
import Login from "../components/Authentification/Login";
import Signup from "../components/Authentification/Signup";

//Stack that has all the screens for Authentification: the buttons with the "login" and "signup", and the
//the two correspondent screens to those buttons.

const AuthStack = () => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="ButtonGroup"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ButtonGroup" component={ButtonGroup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </View>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
