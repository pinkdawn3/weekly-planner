import React from "react";
import { Appbar } from "react-native-paper";
import { colors } from "../theme/colors";

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
      <Appbar.Content title="Chef Planner" />
    </Appbar.Header>
  );
};

export default Header;
