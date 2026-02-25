import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UserCardProps {
  name: string;
  id: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// Card with the information of the users that will appear on the ManageUsers screen.
const UserCard: React.FC<UserCardProps> = ({ name, id, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(id);
  };

  const handleDelete = async () => {
    onDelete(id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.userName}>{name}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleEdit} style={styles.button}>
          <Ionicons name="pencil" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.button}>
          <Ionicons name="trash" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    color: "black",
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 10,
  },
});

export default UserCard;
