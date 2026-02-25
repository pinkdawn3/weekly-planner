import { StyleSheet } from "react-native";
import React from "react";
import { BottomNavigation } from "react-native-paper";
import Homescreen from "../screens/Homescreen";
import WeeklyMenu from "../screens/WeeklyMenu";
import Recipes from "../screens/Recipes";
import UserScreen from "../screens/UserScreen";


//This is the main component while logged in. It has a navigation tab that sits on the bottom and that it's visibile at 
//all moments. It features 4 screens: the Homepage, the Weekly Menu, the Recipes, and the UserScreen.

const BottomTabNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Inicio",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "menu", title: "Menú", focusedIcon: "notebook-outline" },
    { key: "recipes", title: "Recetas", focusedIcon: "chef-hat" },
    {
      key: "user",
      title: "Perfil",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Homescreen,
    menu: WeeklyMenu,
    recipes: Recipes,
    user: UserScreen,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomTabNav;

const styles = StyleSheet.create({});
