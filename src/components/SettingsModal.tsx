import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { Chip } from "react-native-paper";
import { colors } from "../theme/colors";
import { useEffect, useState } from "react";

interface SettingsModalProps<T extends { id: number; name: string }> {
  items: T[];
  selected: T[];
  visible: boolean;
  onClose: (selected: T[]) => void;
}

const SettingsModal = <T extends { id: number; name: string }>({
  items,
  selected,
  visible,
  onClose,
}: SettingsModalProps<T>) => {
  const [tempSelected, setTempSelected] = useState(selected);

  useEffect(() => {
    if (visible) setTempSelected(selected);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.chipContainer}>
            {items.map((item) => {
              const isSelected = tempSelected.some((s) => s.id === item.id);
              return (
                <Chip
                  key={item.id}
                  selected={isSelected}
                  onPress={() => {
                    setTempSelected((prev) =>
                      isSelected
                        ? prev.filter((s) => s.id !== item.id)
                        : [...prev, item],
                    );
                  }}
                  style={styles.chip}
                  textStyle={{ color: colors.darkBrown }}
                >
                  {item.name}
                </Chip>
              );
            })}
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={() => onClose(tempSelected)}
          >
            <Text style={styles.textButton}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.offWhite,
    padding: 40,
    borderWidth: 2,
    borderColor: colors.lightBrown,
    borderRadius: 20,
    maxWidth: "90%",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
    borderWidth: 2,
    borderColor: colors.lightBrown,
  },

  closeButton: {
    backgroundColor: colors.green,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.lightBrown,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },

  textButton: {
    fontSize: 15,
    fontFamily: "ShantellSans-Regular",
    color: colors.darkBrown,
  },
});
