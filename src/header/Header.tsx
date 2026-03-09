import React from "react";
import { Appbar } from "react-native-paper";
import { useColors } from "../theme/useColors";

const Header = () => {
  const colors = useColors();
  return (
    <Appbar.Header
      mode={"center-aligned"}
      style={{
        backgroundColor: colors.accent,
        borderBottomWidth: 2,
        borderBottomColor: colors.border,
      }}
    >
      <Appbar.Content title="Chef Planner" />
    </Appbar.Header>
  );
};

export default Header;
