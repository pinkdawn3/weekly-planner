import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { Recipe } from "../../types/RecipeType";
import { Ionicons } from "@expo/vector-icons";

interface RecipeDetailsProps {
  recipe: Recipe | null;
  onEdit: () => void;
  onDelete: () => void;
}

// Card with the details of the selected recipe. It will show every attribute as well as a button for editing and another one
// for deleting the recipe.

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.modalTitle}>{recipe?.name}</Text>
      <Text style={styles.modalDescription}>{recipe?.description}</Text>
      <Text style={styles.modalSectionTitle}>Ingredientes</Text>
      <Text style={styles.modalText}>{recipe?.ingredients}</Text>
      <Text style={styles.modalSectionTitle}>Tipo</Text>
      <Text style={styles.modalText}>{recipe?.label}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    marginTop: 50,
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

export default RecipeDetails;
