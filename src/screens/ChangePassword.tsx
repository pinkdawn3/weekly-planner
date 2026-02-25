import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useContext } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { DataStackParamList } from "../navigation/UserDataStack";
import { UserInfoContext } from "../contexts/UserInfoContext";
import UserService from "../services/user.service";
import Container, { Toast } from "toastify-react-native";

type Props = StackScreenProps<DataStackParamList, "ChangePassword">;

const ChangePassword: React.FC<Props> = (props) => {
  //State that stores input value
  const { currentUser, setCurrentUser } = useContext(UserInfoContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Function that will take the data from the TextInputs and sends them to the API. It will only do it if both fields are
  //the same, otherwise it will warn the user.
  const handleChangePassword = async () => {
    if (newPassword == "" || confirmPassword == "") {
      Toast.error("Rellena los campos", "top");
    } else if (newPassword === confirmPassword) {
      try {
        const userUpdate = {
          userName: currentUser.userName,
          email: currentUser.email,
          password: newPassword,
        };
        console.log("User Update:", userUpdate);
        await UserService.updateUser(userUpdate, currentUser.id);
        setCurrentUser({ ...currentUser, password: newPassword });
        props.navigation.goBack();
      } catch (error) {
        console.error("Error changing password:", error);
      }
    } else {
      Toast.warn("Las contraseñas no coinciden.", "top");
    }
  };
  return (
    <View style={styles.container}>
      <Container width={370} />
      <Text style={styles.greetingText}>Cambiar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Aceptar</Text>
      </Pressable>
    </View>
  );
};

export default ChangePassword;

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
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
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
});
