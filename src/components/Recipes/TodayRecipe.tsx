import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { RecipeContext } from "../../contexts/Recipe/RecipeContext";
import { MenuRecipe } from "../../types/recipeType";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useTranslate } from "../../hooks/useTranslations";
import { useColors } from "../../theme/useColors";

const TodayRecipe = () => {
  const colors = useColors();

  const { currentMenu } = useContext(RecipeContext);
  const { _ } = useLingui();
  const t = useTranslate();

  const [todaysRecipes, setTodaysRecipes] = useState<MenuRecipe[]>([]);
  const currentDate = moment().format("dddd");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (currentMenu && currentMenu.recipes && currentMenu.recipes.length > 0) {
      const todayRecipes = currentMenu.recipes.filter(
        (mr) => mr.weekDay === currentDate,
      );
      setTodaysRecipes(todayRecipes);
    }
  }, [currentMenu]);

  const handlePress = (menuRecipe: MenuRecipe) => {
    console.log("handlePress called", menuRecipe.recipe.name);
    navigation.navigate("RecipeDetailsScreen", { recipe: menuRecipe.recipe });
  };

  const hasMenu =
    currentMenu && currentMenu.recipes && currentMenu.recipes.length > 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardToday, borderColor: colors.border },
      ]}
    >
      {hasMenu ? (
        todaysRecipes.length > 0 ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              <Trans>Today we eat...</Trans>
            </Text>
            {todaysRecipes.map((mr) => (
              <Pressable
                key={mr.mealType.id}
                onPress={() => handlePress(mr)}
                accessibilityRole="button"
                accessibilityLabel={`${mr.mealType.name}: ${mr.recipe.name}`}
              >
                <Text style={[styles.mealType, { color: colors.textVariant }]}>
                  {t(mr.mealType.name)}
                </Text>
                <Text
                  style={[styles.recipeName, { color: colors.textVariant }]}
                >
                  {mr.recipe.name}
                </Text>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.noMenuTextTitle}>
              <Trans>Recipe for today not found.</Trans>
            </Text>
            <Text style={styles.noMenuText}>
              <Trans>Edit the menu to add a recipe.</Trans>
            </Text>
          </>
        )
      ) : (
        <View
          accessibilityRole="text"
          accessibilityLabel={_(
            msg`No menu available. Add recipes or create a menu.`,
          )}
        >
          <Text style={styles.noMenuTextTitle}>
            <Trans>No menu available!</Trans>
          </Text>
          <Text style={styles.noMenuText}>
            <Trans>Add recipes or create a menu.</Trans>
          </Text>
        </View>
      )}
    </View>
  );
};

export default TodayRecipe;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "ShantellSans-Bold",
    textAlign: "center",
  },
  mealType: {
    fontSize: 14,
    marginTop: 10,
    fontFamily: "ShantellSans-SemiBoldItalic",
  },
  recipeName: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: "ShantellSans-SemiBold",
  },
  noMenuTextTitle: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "ShantellSans-SemiBold",
  },
  noMenuText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "ShantellSans-Regular",
  },
});
