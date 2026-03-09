import React from "react";
import { BottomNavigation } from "react-native-paper";
import Homescreen from "../screens/Homescreen";
import WeeklyMenu from "../screens/WeeklyMenu";
import Recipes from "../screens/Recipes";
import { colors } from "../theme/colors";
import Settings from "../screens/Settings";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useColors } from "../theme/useColors";

//This is the main component while logged in. It has a navigation tab that sits on the bottom and that it's visibile at
//all moments. It features 4 screens: the Homepage, the Weekly Menu, the Recipes, and the UserScreen.

const BottomTabNav = () => {
  const colors = useColors();
  const { _ } = useLingui();
  const [index, setIndex] = React.useState(0);

  const routes = [
    {
      key: "home",
      title: _(msg`Home`),
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "menu", title: _(msg`Menu`), focusedIcon: "notebook-outline" },
    { key: "recipes", title: _(msg`Recipes`), focusedIcon: "chef-hat" },
    { key: "settings", title: _(msg`Settings`), focusedIcon: "cog" },
  ];

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
        backgroundColor: colors.accent,
        borderTopWidth: 2,
        borderTopColor: colors.border,
      }}
      activeColor={colors.iconVariant}
      inactiveColor={colors.icon}
    />
  );
};

export default BottomTabNav;
