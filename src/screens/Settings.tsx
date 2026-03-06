import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../theme/colors";
import { Menu } from "react-native-paper";
import { useContext, useState } from "react";
import DashedButton from "../components/Core/DashedButton";
import { exportData, importData } from "../services/backup.service";
import { RecipeContext } from "../contexts/RecipeContext";
import {
  getAllRecipes,
  getAllMealTypes,
  getAllLabels,
} from "../services/db/database.service";

const Settings = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const { setRecipes, setMealTypes, setLabels } = useContext(RecipeContext);

  const dropdownStyle = {
    borderRadius: 18,
    borderColor: colors.lightBrown,
    borderWidth: 2,
    backgroundColor: colors.offWhite,
  };

  const handleImport = async () => {
    try {
      const success = await importData();
      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setRecipes(getAllRecipes());
        setMealTypes(getAllMealTypes());
        setLabels(getAllLabels());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <DashedButton
        title="Import"
        color={colors.orange}
        background={colors.transparentYellow}
        style={{ alignSelf: "center" }}
        onPress={handleImport}
      />
      <DashedButton
        title="Export"
        color={colors.orange}
        background={colors.transparentYellow}
        style={{ alignSelf: "center" }}
        onPress={exportData}
      />

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <DashedButton
            title={selected || "Language..."}
            color={colors.orange}
            background={colors.transparentYellow}
            style={{ alignSelf: "center", marginBottom: 20 }}
            onPress={() => setVisible(true)}
          />
        }
        anchorPosition="bottom"
        contentStyle={dropdownStyle}
        elevation={0}
      >
        <Menu.Item
          onPress={() => {
            setSelected("English");
            setVisible(false);
          }}
          title="English"
        />
        <Menu.Item
          onPress={() => {
            setSelected("Spanish");
            setVisible(false);
          }}
          title="Spanish"
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
    paddingHorizontal: 40,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
