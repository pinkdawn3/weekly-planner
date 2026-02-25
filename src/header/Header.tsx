import { StyleSheet } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";

// Header with the name of the name of the App that will be visible at any moment.
const Header = () => {
  return (
    <Appbar.Header
      mode={"center-aligned"}
      style={{ backgroundColor: "#FFF0e7" }}
    >
      <Appbar.Content title="Weekly Meal" />
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({});
