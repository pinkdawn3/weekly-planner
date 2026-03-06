import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../theme/colors";
import { Menu } from "react-native-paper";
import { useState } from "react";

const Settings = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <Text>Importar</Text>
      <Text>Exportar</Text>
      <Text>Idioma</Text>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)}>
            <Text>{selected || "Seleccionar..."}</Text>
          </Pressable>
        }
        anchorPosition="bottom"
      >
        <Menu.Item
          onPress={() => {
            setSelected("Inglés");
            setVisible(false);
          }}
          title="Inglés"
        />
        <Menu.Item
          onPress={() => {
            setSelected("Español");
            setVisible(false);
          }}
          title="Español"
        />
      </Menu>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparentYellow,
    padding: 40,
  },
});
