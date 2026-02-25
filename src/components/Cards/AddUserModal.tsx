import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useContext } from "react";
import { Button } from "react-native-paper";
import Container, { Toast } from "toastify-react-native";
import { UserInfoContext } from "../../contexts/UserInfoContext";
import UserService from "../../services/user.service";
import { UserInfo } from "../../types/UserInfo";

interface AddUserModalProps {
  onDismiss: () => void;
}

// Only for Admins
const AddUserModal: React.FC<AddUserModalProps> = ({ onDismiss }) => {
  //States to store input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUsers } = useContext(UserInfoContext);

  //Function that will take the data from the two TextInputs and send them to the API to create a new user.
  const handleAddUser = async () => {
    try {
      const newUser = {
        userName: username,
        email: email,
        password: password,
      };
      const createdUser = await UserService.register(newUser);
      setUsers((prevUsers: UserInfo[]) => [...prevUsers, createdUser]);
      onDismiss();
    } catch (error) {
      Toast.error("Error al añadir el usuario. Inténtalo de nuevo.", "top");
      console.error("Error adding user:", error);
    }
  };

  return (
    <View>
      <Container width={370} />
      <Text style={styles.modalTitle}>Añadir Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca nombre..."
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca email..."
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca contraseña..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleAddUser}>
        Guardar
      </Button>
    </View>
  );
};

export default AddUserModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderRadius: 10,
    height: 45,
    marginVertical: 10,
    borderWidth: 1,
    padding: 12,
    backgroundColor: "white",
    borderColor: "gray",
  },
});
