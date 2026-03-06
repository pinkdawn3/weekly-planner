import React from "react";
import { BottomNavigation } from "react-native-paper";
import Homescreen from "../screens/Homescreen";
import WeeklyMenu from "../screens/WeeklyMenu";
import Recipes from "../screens/Recipes";
import { colors } from "../theme/colors";
import Settings from "../screens/Settings";

//This is the main component while logged in. It has a navigation tab that sits on the bottom and that it's visibile at
//all moments. It features 4 screens: the Homepage, the Weekly Menu, the Recipes, and the UserScreen.

const BottomTabNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "menu", title: "Menu", focusedIcon: "notebook-outline" },
    { key: "recipes", title: "Recipes", focusedIcon: "chef-hat" },
    { key: "settings", title: "Settings", focusedIcon: "cog" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Homescreen,
    menu: WeeklyMenu,
    recipes: Recipes,
    settings: Settings,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: "#ffcea3",
        borderTopWidth: 2,
        borderTopColor: colors.lightBrown,
      }}
      activeColor="#624942"
      inactiveColor="#97746b"
    />
  );
};

export default BottomTabNav;
