import React from "react";
import { Appbar } from "react-native-paper";
import { colors } from "../theme/colors";

// Header with the name of the name of the App that will be visible at any moment.
const Header = () => {
  return (
    <Appbar.Header
      mode={"center-aligned"}
      style={{
        backgroundColor: colors.orange,
        borderBottomWidth: 2,
        borderBottomColor: colors.lightBrown,
      }}
    >
      <Appbar.Content title="Weekly Meal" />
    </Appbar.Header>
  );
};

export default Header;
