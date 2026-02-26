import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "../../types/RecipeType";
import {
  createLabel,
  deleteLabel,
  getAllLabels,
} from "../../services/database.service";

interface ManageLabelsProps {
  labels: Label[];
  onUpdate: (updated: Label[]) => void;
}

const ManageLabels: React.FC<ManageLabelsProps> = ({ labels, onUpdate }) => {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    createLabel(newName.trim());
    onUpdate(getAllLabels());
    setNewName("");
  };

  const handleDelete = (id: number) => {
    deleteLabel(id);
    onUpdate(getAllLabels());
  };

  return (
    <View>
      <Text style={styles.title}>Categorías</Text>
      {labels.map((l) => (
        <View key={l.id} style={styles.listItem}>
          <Text style={styles.itemText}>{l.name}</Text>
          <Pressable onPress={() => handleDelete(l.id)}>
            <Ionicons name="trash-outline" size={20} color="#f28966" />
          </Pressable>
        </View>
      ))}
      <TextInput
        label="Nueva categoría"
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

export default ManageLabels;

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
