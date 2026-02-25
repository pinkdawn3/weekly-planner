import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChangeUser from "../screens/ChangeUser";
import ChangePassword from "../screens/ChangePassword";
import ManageUsers from "../screens/ManageUsers";
import DataButtonGroup from "../components/DataButtonGroup";

export type DataStackParamList = {
  DataButtonGroup: undefined;
  ChangeUser: undefined;
  ChangePassword: undefined;
  ManageUsers: undefined;
};

const Stack = createStackNavigator<DataStackParamList>();

//Stack with the different screens inside of the UserScreen section.

const UserDataStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DataButtonGroup"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChangeUser" component={ChangeUser} />
      <Stack.Screen name="DataButtonGroup" component={DataButtonGroup} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} />
    </Stack.Navigator>
  );
};

export default UserDataStack;
