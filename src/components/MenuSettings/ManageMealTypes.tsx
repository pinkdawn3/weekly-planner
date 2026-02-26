import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MealType } from "../../types/RecipeType";
import {
  createMealType,
  deleteMealType,
  getAllMealTypes,
} from "../../services/database.service";

interface ManageMealTypesProps {
  mealTypes: MealType[];
  onUpdate: (updated: MealType[]) => void;
}

const ManageMealTypes: React.FC<ManageMealTypesProps> = ({
  mealTypes,
  onUpdate,
}) => {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    createMealType(newName.trim());
    onUpdate(getAllMealTypes());
    setNewName("");
  };

  const handleDelete = (id: number) => {
    deleteMealType(id);
    onUpdate(getAllMealTypes());
  };

  return (
    <View>
      <Text style={styles.title}>Tipos de comida</Text>
      {mealTypes.map((mt) => (
        <View key={mt.id} style={styles.listItem}>
          <Text style={styles.itemText}>{mt.name}</Text>
          <Pressable onPress={() => handleDelete(mt.id)}>
            <Ionicons name="trash-outline" size={20} color="#f28966" />
          </Pressable>
        </View>
      ))}
      <TextInput
        label="Nuevo tipo de comida"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Añadir</Text>
      </Pressable>
    </View>
  );
};

export default ManageMealTypes;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    marginTop: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#dbeed0",
    borderColor: "gray",
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "bold",
    color: "black",
  },
});
