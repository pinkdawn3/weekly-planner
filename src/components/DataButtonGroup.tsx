import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { DataStackParamList } from "../navigation/UserDataStack";
import { UserInfoContext } from "../contexts/UserInfoContext";
import UserService from "../services/user.service";
import { reset } from "../navigation/NavigationContainer";

type Props = StackScreenProps<DataStackParamList, "DataButtonGroup">;

// Buttons that will navigate towards the different screens to manage user information. The ManageUsers button will only
// be visible for Admins.
const DataButtonGroup: React.FC<Props> = (props) => {
  const { currentUser, setisLogged } = React.useContext(UserInfoContext);

  //Function to log-out and go towards the Authentification Screen
  const handleLogout = async () => {
    try {
      await UserService.logout();
      setisLogged(false);
      reset("AuthStack");
      console.log("Cerrando sesión");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      {currentUser && (
        <Text style={styles.greetingText}>Hola, {currentUser.userName}</Text>
      )}

      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.push("ChangeUser")}
        >
          <Text style={styles.buttonText}>Cambiar usuario</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.push("ChangePassword")}
        >
          <Text style={styles.buttonText}>Cambiar contraseña</Text>
        </Pressable>

        {currentUser?.role === "ADMIN" && (
          <Pressable
            style={styles.button}
            onPress={() => props.navigation.push("ManageUsers")}
          >
            <Text style={styles.buttonText}>Administrar usuarios</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DataButtonGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonGroup: {
    width: "100%",
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 10,
    backgroundColor: "#dbeed0",
    borderColor: "grey",
    borderWidth: 1,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#f28966",
  },
  logoutButtonText: {
    color: "#fff",
  },
});
