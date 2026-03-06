import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/RecipeContext";
import { Modal, Portal, Searchbar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { Recipe } from "../types/RecipeType";
import ManageMealTypes from "../components/MenuSettings/ManageMealTypes";
import ManageLabels from "../components/MenuSettings/ManageLabel";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";
import DashedButton from "../components/Core/DashedButton";
import DottedBackground from "../components/Core/DottedBackground";

const Recipes = () => {
  const { recipes, mealTypes, setMealTypes, labels, setLabels } =
    useContext(RecipeContext);

  const [mealTypesVisible, setMealTypesVisible] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(false);

  // Navigation for Details and AddRecipe screens
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const showDetailsScreen = (recipe: Recipe) => {
    navigation.navigate("RecipeDetailsScreen", { recipe });
  };

  const showAddRecipeScreen = () => {
    navigation.navigate("AddRecipe");
  };

  // Function that filters the recipes based on the input text
  const [searchText, setSearchText] = useState("");

  const searchRecipe = () => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  const filteredRecipes = searchRecipe();

  return (
    <View style={styles.container}>
      <DottedBackground />
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <Portal>
          {/* Modals for editing meal types and meal labels */}
          <Modal
            visible={mealTypesVisible}
            onDismiss={() => setMealTypesVisible(false)}
          >
            <ManageMealTypes mealTypes={mealTypes} onUpdate={setMealTypes} />
          </Modal>

          <Modal
            visible={labelsVisible}
            onDismiss={() => setLabelsVisible(false)}
          >
            <ManageLabels labels={labels} onUpdate={setLabels} />
          </Modal>
        </Portal>

        {/* Buttons for editing meal types and meal labels */}

        <View style={styles.configButtons}>
          <DashedButton
            title="Tipos de comida"
            color={colors.purple}
            background={colors.transparentYellow}
            onPress={() => setMealTypesVisible(true)}
          />

          <DashedButton
            title="Categorías"
            color={colors.purple}
            background={colors.transparentYellow}
            size={{ paddingHorizontal: 30 }}
            onPress={() => setLabelsVisible(true)}
          />
        </View>

        {/* Search bar to search recipes by name */}
        <Searchbar
          placeholder="Buscar receta..."
          onChangeText={setSearchText}
          value={searchText}
          style={{
            borderWidth: 2,
            borderColor: colors.lightBrown,
            marginBottom: 10,
          }}
          inputStyle={{ color: colors.darkBrown }}
          theme={{
            colors: {
              onSurface: colors.lightBrown,
              onSurfaceVariant: colors.lightBrown,
            },
          }}
        />

        {/* Floating button to show the add recipe modal */}
        <Pressable
          style={styles.floatingButtonContainer}
          onPress={() => {
            showAddRecipeScreen();
          }}
        >
          <View style={styles.innerButton}>
            <Entypo name="plus" size={24} color={colors.transparentYellow} />
          </View>
        </Pressable>

        {/* Scroll view to display filtered recipes */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredRecipes &&
            filteredRecipes.map((recipe, index) => (
              <Pressable key={index} onPress={() => showDetailsScreen(recipe)}>
                <View style={styles.card}>
                  <Text style={styles.title}>{recipe.name}</Text>
                  <Text style={styles.detailsLink}>Ver detalles</Text>
                </View>
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Recipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: colors.offWhite,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.lightBrown,
  },
  title: {
    fontSize: 22,
    fontFamily: "ShantellSans-SemiBold",
    color: colors.darkBrown,
    marginBottom: 8,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,

    backgroundColor: colors.darkOrange,
    borderRadius: 50,
    borderColor: colors.darkOrange,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  innerButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 50,
    borderColor: colors.transparentYellow,
    padding: 15,
  },
  detailsLink: {
    color: colors.darkOrange,
    fontFamily: "ShantellSans-Regular",
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: colors.offWhite,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsContainer: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  configButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  configButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#dbeed0",
    borderColor: colors.green,
    borderWidth: 2,
  },
  innerBorder: {
    backgroundColor: "#dbeed0",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.yellow,
  },

  configButtonText: {
    fontFamily: "ShantellSans-Regular",
    color: colors.darkBrown,
  },
});
