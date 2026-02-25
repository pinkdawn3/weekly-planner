import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import UserCard from "../components/Cards/UserCard";
import { UserInfoContext } from "../contexts/UserInfoContext";
import UserService from "../services/user.service";
import EditUserModal from "../components/Cards/EditUserModal";
import AddUserModal from "../components/Cards/AddUserModal";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

//From this component the Admins can add users, edit the users' username and password or delete users.
const ManageUsers = () => {
  const { users, setUsers } = useContext(UserInfoContext);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserService.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // If the edited user is not on the list, closes the modal and cleans the list
    if (editUserId !== null && !users.some((user) => user.id === editUserId)) {
      setEditUserId(null);
      setEditModalVisible(false);
    }
  }, [users, editUserId]);

  const handleEditUser = (id: number) => {
    setEditUserId(id);
    setEditModalVisible(true);
  };

  const handleDismissModal = () => {
    setEditModalVisible(false);
    setEditUserId(null);
  };

  const handleAddUser = () => {
    setAddModalVisible(true);
  };

  const handleDismissAddModal = () => {
    setAddModalVisible(false);
  };

  const handleDelete = async (idToDelete: number) => {
    try {
      await UserService.deleteUser(idToDelete);
      const userData = await UserService.getAllUsers();
      setUsers(userData);
      console.log("Usuario borrado correctamente");
    } catch (error) {}
    console.log("Eliminar usuario con id:", idToDelete);
  };

  const containerStyle = {
    backgroundColor: "white",
    padding: 30,
    margin: 20,
    borderRadius: 10,
  };

  const selectedUser = users?.find((user) => user.id === editUserId);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Ionicons name="add-circle" size={24} color="black" />
          <Text style={styles.addButtonText}>Añadir Usuario</Text>
        </TouchableOpacity>
        <ScrollView>
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user.id}
                name={user.userName}
                id={user.id}
                onEdit={handleEditUser}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Text>No users found</Text>
          )}
        </ScrollView>
        {selectedUser && (
          <Portal>
            <Modal
              visible={editModalVisible}
              onDismiss={handleDismissModal}
              contentContainerStyle={containerStyle}
            >
              <EditUserModal user={selectedUser} />
            </Modal>
          </Portal>
        )}
        <Portal>
          <Modal
            visible={addModalVisible}
            onDismiss={handleDismissAddModal}
            contentContainerStyle={containerStyle}
          >
            <AddUserModal onDismiss={handleDismissAddModal} />
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default ManageUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeed0",
    padding: 10,
    margin: 20,
    borderRadius: 10,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  addButtonText: {
    color: "black",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
