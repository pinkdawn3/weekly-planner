import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthHomepage";

type Props = StackScreenProps<RootStackParamList, "ButtonGroup">;

// These buttons are the ones that appear in the Authentification screen.

const ButtonGroup: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.push("Login")}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.push("Signup")}
        >
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ButtonGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  buttonGroup: {
    height: 150,
    justifyContent: "space-around",
  },
  button: {
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
