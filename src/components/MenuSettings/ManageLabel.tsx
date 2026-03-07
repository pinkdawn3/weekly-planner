import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "../../types/recipeType";
import {
  createLabel,
  deleteLabel,
  getAllLabels,
  getAllRecipes,
} from "../../services/db/database.service";
import { colors } from "../../theme/colors";
import DashedButton from "../Core/DashedButton";
import { Trans } from "@lingui/react/macro";
import { useTranslate } from "../../hooks/useTranslations";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { RecipeContext } from "../../contexts/Recipe/RecipeContext";
import ConfirmDeleteModal from "../Core/ConfirmDeleteModal";

interface ManageLabelsProps {
  labels: Label[];
  onUpdate: (updated: Label[]) => void;
}

const ManageLabels: React.FC<ManageLabelsProps> = ({ labels, onUpdate }) => {
  const { setRecipes } = useContext(RecipeContext);
  const [newName, setNewName] = useState("");
  const t = useTranslate();
  const { _ } = useLingui();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    createLabel(newName.trim());
    onUpdate(getAllLabels());
    setNewName("");
  };

  const handleDelete = () => {
    if (selectedId === null) return;
    deleteLabel(selectedId);
    onUpdate(getAllLabels());
    setRecipes(getAllRecipes());
  };

  return (
    <View style={styles.container}>
      <ConfirmDeleteModal
        visible={confirmVisible}
        onDismiss={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          handleDelete();
        }}
        itemName={selectedName}
      />
      <Text style={styles.title}>
        <Trans>Categories</Trans>
      </Text>
      {labels.map((l) => (
        <View key={l.id} style={styles.listItem}>
          <Text style={styles.itemText}>{t(l.name)}</Text>
          <Pressable
            onPress={() => {
              setSelectedId(l.id);
              setSelectedName(l.name);
              setConfirmVisible(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={_(msg`Delete meal category`)}
          >
            <Ionicons name="trash-outline" size={20} color="#f28966" />
          </Pressable>
        </View>
      ))}
      <TextInput
        placeholder={_(msg`Add category...`)}
        placeholderTextColor={colors.lightBrown}
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
        accessibilityLabel={newName}
        accessibilityHint={_(msg`Enter meal category`)}
      />

      <DashedButton
        title={_(msg`Add`)}
        color={colors.purple}
        style={{ alignSelf: "center", marginTop: 20 }}
        size={{ paddingHorizontal: 30 }}
        background={colors.offWhite}
        onPress={handleAdd}
        accessibilityLabel={_(msg`Add meal category`)}
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
});
