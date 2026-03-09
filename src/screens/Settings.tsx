import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { colors } from "../theme/colors";
import { Menu } from "react-native-paper";
import { useContext, useState } from "react";
import DashedButton from "../components/Core/DashedButton";
import { exportData, importData } from "../services/backup.service";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import {
  getAllRecipes,
  getAllMealTypes,
  getAllLabels,
} from "../services/db/database.service";
import { UserContext } from "../contexts/User/UserContext";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useTranslate } from "../hooks/useTranslations";
import { useLingui } from "@lingui/react";
import { Feather } from "@expo/vector-icons";
import { useColors } from "../theme/useColors";

const Settings = () => {
  const [visible, setVisible] = useState(false);
  const { setRecipes, setMealTypes, setLabels } = useContext(RecipeContext);
  const { language, handleSetLanguage, theme, toggleTheme } =
    useContext(UserContext);

  const colors = useColors();

  const { _ } = useLingui();
  const t = useTranslate();

  const dropdownStyle = {
    borderRadius: 18,
    borderColor: colors.border,
    borderWidth: 2,
    backgroundColor: colors.cardBackground,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <Pressable style={styles.themeButton} onPress={toggleTheme}>
        {theme == "light" ? (
          <Feather name="sun" size={25} color={colors.icon} />
        ) : (
          <Feather name="moon" size={24} color={colors.icon} />
        )}
      </Pressable> */}
      <DashedButton
        title={_(msg`Import`)}
        color={colors.accent}
        background={colors.background}
        style={{ alignSelf: "center" }}
        onPress={handleImport}
        accessibilityLabel={_(msg`Import user data`)}
      />
      <DashedButton
        title={_(msg`Export`)}
        color={colors.accent}
        background={colors.background}
        style={{ alignSelf: "center" }}
        onPress={exportData}
        accessibilityLabel={_(msg`Export user data`)}
      />

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <DashedButton
            title={t(language)}
            color={colors.accent}
            background={colors.background}
            style={{ alignSelf: "center", marginBottom: 20 }}
            onPress={() => setVisible(true)}
            accessibilityLabel={_(msg`Change language`)}
          />
        }
        anchorPosition="bottom"
        contentStyle={dropdownStyle}
        elevation={0}
      >
        <Menu.Item
          onPress={() => {
            handleSetLanguage("en");
            setVisible(false);
          }}
          title="English"
        />
        <Menu.Item
          onPress={() => {
            handleSetLanguage("es");
            setVisible(false);
          }}
          title="Spanish"
        />
      </Menu>

      <Pressable
        onPress={() => Linking.openURL("https://ko-fi.com/sunrisemorning")}
        accessibilityRole="button"
        accessibilityLabel={_(msg`Support me on ko-fi`)}
      >
        <Text style={[styles.kofi, { color: colors.text }]}>
          <Trans>☕ Support the project!</Trans>
        </Text>
      </Pressable>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  kofi: {
    fontFamily: "ShantellSans-Regular",
  },
  themeButton: {
    position: "absolute",
    top: 30,
    right: 20,
  },
});
