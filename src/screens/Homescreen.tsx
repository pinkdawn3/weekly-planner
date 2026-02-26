import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import NewMenu from "../components/NewMenu";
import TodayRecipe from "../components/Recipes/TodayRecipe";
import { RecipeContext } from "../contexts/RecipeContext";
import { Menu } from "../types/RecipeType";
import { getLastMenu } from "../services/database.service";

const menuDefault: Menu = { id: 0, created: "", recipes: [] };

const Homescreen = () => {
  const { recipes, setCurrentMenu, menuCreated, setMenuCreated } =
    useContext(RecipeContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenuModal = () => setMenuVisible(true);
  const hideMenuModal = () => setMenuVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 30,
    margin: 20,
    borderRadius: 10,
  };

  useEffect(() => {
    try {
      const menuData = getLastMenu();
      setCurrentMenu(menuData ?? menuDefault);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (menuCreated) {
      try {
        const menuData = getLastMenu();
        setCurrentMenu(menuData ?? menuDefault);
      } catch (error) {
        console.log(error);
      } finally {
        setMenuCreated(false);
      }
    }
  }, [menuCreated]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TodayRecipe />

        <Portal>
          <Modal
            visible={menuVisible}
            onDismiss={hideMenuModal}
            contentContainerStyle={containerStyle}
          >
            <NewMenu onCloseModal={hideMenuModal} />
          </Modal>
        </Portal>

        <Pressable
          style={[
            styles.newMenuButton,
            recipes.length < 7 && styles.disabledButton,
          ]}
          onPress={recipes.length >= 7 ? showMenuModal : null}
          disabled={recipes.length < 7}
        >
          <Text style={styles.buttonText}>Crear menú nuevo</Text>
        </Pressable>
        {recipes.length < 7 && (
          <Text style={styles.infoText}>
            Añade al menos 7 recetas para crear un menú nuevo.
          </Text>
        )}
      </View>
    </PaperProvider>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  newMenuButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
  },
});
