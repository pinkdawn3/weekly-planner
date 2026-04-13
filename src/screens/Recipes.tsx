import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "../contexts/Recipe/RecipeContext";
import { Modal, Portal, Searchbar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { Recipe } from "../types/recipeType";
import ManageMealTypes from "../components/MenuSettings/ManageMealTypes";
import ManageLabels from "../components/MenuSettings/ManageLabel";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import DashedButton from "../components/Core/DashedButton";
import DottedBackground from "../components/Core/DottedBackground";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useColors } from "../theme/useColors";

const Recipes = () => {
  const { recipes, mealTypes, setMealTypes, labels, setLabels } =
    useContext(RecipeContext);

  const { _ } = useLingui();
  const colors = useColors();

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

  const filteredRecipes = searchRecipe().sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <View style={[styles.container]}>
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
            title={_(msg`Types of meals`)}
            color={colors.button}
            background={colors.background}
            onPress={() => setMealTypesVisible(true)}
            accessibilityLabel={_(msg`Manage types of meals`)}
          />

          <DashedButton
            title={_(msg`Categories`)}
            color={colors.button}
            background={colors.background}
            size={{ paddingHorizontal: 30 }}
            onPress={() => setLabelsVisible(true)}
            accessibilityLabel={_(msg`Manage categories of meals`)}
          />
        </View>

        {/* Search bar to search recipes by name */}
        <Searchbar
          placeholder={_(msg`Search recipe...`)}
          onChangeText={setSearchText}
          value={searchText}
          style={{
            borderWidth: 2,
            borderColor: colors.textVariant,
            marginBottom: 10,
          }}
          inputStyle={{ color: colors.text }}
          theme={{
            colors: {
              onSurface: colors.border,
              onSurfaceVariant: colors.border,
            },
          }}
        />

        {/* Floating button to show the add recipe modal */}
        <Pressable
          style={[
            styles.floatingButtonContainer,
            {
              backgroundColor: colors.accentVariant,
              borderColor: colors.accentVariant,
            },
          ]}
          onPress={() => {
            showAddRecipeScreen();
          }}
          accessibilityRole="button"
          accessibilityLabel={_(msg`Add recipe`)}
        >
          <View
            style={[
              styles.innerButton,
              {
                backgroundColor: colors.accentVariant,
                borderColor: colors.background,
              },
            ]}
          >
            <Entypo name="plus" size={24} color={colors.background} />
          </View>
        </Pressable>

        {/* Scroll view to display filtered recipes */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredRecipes &&
            filteredRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => showDetailsScreen(recipe)}
                accessibilityLabel={`${recipe.name}, ${_(msg`See details`)}`}
              >
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.title, { color: colors.text }]}>
                    {recipe.name}
                  </Text>
                  <Text
                    style={[
                      styles.detailsLink,
                      { color: colors.accentVariant },
                    ]}
                  >
                    <Trans>See details</Trans>
                  </Text>
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
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontFamily: "ShantellSans-SemiBold",
    marginBottom: 8,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    borderRadius: 50,
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
    padding: 15,
  },
  detailsLink: {
    fontFamily: "ShantellSans-Regular",
    marginTop: 10,
  },
  configButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
