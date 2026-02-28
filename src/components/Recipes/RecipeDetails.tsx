import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Chip } from "react-native-paper";
import { Recipe } from "../../types/RecipeType";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecipeDetailsProps {
  recipe: Recipe | null;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  onEdit,
  onDelete,
}) => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.detailsContainer}>
        <Text style={styles.modalTitle}>{recipe?.name}</Text>
        <Text style={styles.modalDescription}>{recipe?.description}</Text>

        <Text style={styles.modalSectionTitle}>Tipo de comida</Text>
        <View style={styles.chipContainer}>
          {recipe?.mealTypes.map((mt) => (
            <Chip key={mt.id} style={styles.chip}>
              {mt.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.modalSectionTitle}>Categoría</Text>
        <View style={styles.chipContainer}>
          {recipe?.labels.map((l) => (
            <Chip key={l.id} style={styles.chip}>
              {l.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.modalSectionTitle}>Ingredientes</Text>
        <Text style={styles.modalText}>{recipe?.ingredients}</Text>

        <Text style={styles.modalSectionTitle}>Pasos</Text>
        <Text style={styles.modalText}>{recipe?.steps}</Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onEdit}>
            <Ionicons name="pencil" size={24} color="black" />
            <Text style={styles.buttonText}>Editar</Text>
          </Pressable>
          <Pressable style={styles.buttonDelete} onPress={onDelete}>
            <Ionicons name="trash" size={24} color="black" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default RecipeDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    color: "#333",
    marginBottom: 10,
    fontFamily: "ShantellSans-Bold",
  },
  modalDescription: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    fontFamily: "ShantellSans-Regular",
  },
  modalSectionTitle: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
    fontFamily: "ShantellSans-SemiBold",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "ShantellSans-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#dbeed0",
  },
  buttonDelete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f28966",
  },
  buttonText: {
    marginLeft: 5,
    color: "black",
    fontWeight: "bold",
  },
});
