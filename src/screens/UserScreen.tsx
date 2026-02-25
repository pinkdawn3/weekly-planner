import { StyleSheet, View } from "react-native";
import React from "react";
import UserDataStack from "../navigation/UserDataStack";

// The userscreen only contains the UserDataStack with the buttons to all the components neccesary for managing user data:
// change username, change password, seeing all menus or loging out.
const UserScreen = () => {
  return (
    <View style={styles.container}>
      <UserDataStack />
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
