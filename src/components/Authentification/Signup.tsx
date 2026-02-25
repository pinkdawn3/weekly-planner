import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import type { StackScreenProps } from "@react-navigation/stack";
import Container, { Toast } from "toastify-react-native";
import { RootStackParamList } from "../../navigation/AuthHomepage";
import UserService from "../../services/user.service";

type Props = StackScreenProps<RootStackParamList, "Signup">;

const Signup: React.FC<Props> = (props) => {

  //State that stores input values
  const [formData, setFormData] = React.useState({
    userName: "",
    email: "",
    password: "",
  });

  //Function that handles user input
  const handleInputChange = async (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Function that handles the creation of a new user with the information submited by the user in formData.
  // It will send a HTTP petition to the API, and if it's successfull it will go back for the user to log-in, as it
  // isn't automatic. If at any point the user inputs something wrong, the app will show an error message to the user.
  const handleSignup = async () => {
    if (
      formData.userName === "" ||
      formData.password === "" ||
      formData.email === ""
    ) {
      Toast.warn("Rellena los 3 campos.", "top");
    } else {
      try {
        await UserService.register(formData);
        props.navigation.goBack();
      } catch (error) {
        Toast.error("Error durante el registro.", "top");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Container width={370} />
      <View style={styles.buttonGroup}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          onChangeText={(value) => handleInputChange("userName", value)}
          value={formData.userName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleInputChange("email", value)}
          value={formData.email}
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Contraseña"
          value={formData.password}
          secureTextEntry={true}
        />
        <Pressable style={styles.button} onPress={() => handleSignup()}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  buttonGroup: {
    height: 200,
    justifyContent: "space-around",
  },
  input: {
    borderRadius: 10,
    height: 45,
    margin: 12,
    borderWidth: 1,
    padding: 12,
    backgroundColor: "white",
    borderColor: "gray",
  },
  button: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});
