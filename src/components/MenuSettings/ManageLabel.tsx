import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "../../types/RecipeType";
import {
  createLabel,
  deleteLabel,
  getAllLabels,
} from "../../services/db/database.service";
import { colors } from "../../theme/colors";
import DashedButton from "../Core/DashedButton";

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
    <View style={styles.container}>
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
        placeholder="Añadir categoría..."
        placeholderTextColor={colors.lightBrown}
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />

      <DashedButton
        title="Añadir"
        color={colors.green}
        style={{ alignSelf: "center", marginTop: 20 }}
        size={{ paddingHorizontal: 30 }}
        background={colors.offWhite}
        onPress={handleAdd}
      />
    </View>
  );
};

export default ManageLabels;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.lightBrown,
    margin: 40,
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: colors.darkBrown,
    marginBottom: 15,
    alignSelf: "center",
    fontFamily: "ShantellSans-SemiBold",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    color: colors.darkBrown,
    fontFamily: "ShantellSans-Regular",
  },
  input: {
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.lightBrown,
    paddingHorizontal: 10,
    fontFamily: "ShantellSans-Regular",
  },
  button: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: colors.green,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.lightBrown,
  },
  buttonText: {
    color: colors.darkBrown,
    fontFamily: "ShantellSans-SemiBold",
  },
});
