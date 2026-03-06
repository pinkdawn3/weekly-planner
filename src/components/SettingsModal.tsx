import { View, StyleSheet, Pressable, Text } from "react-native";
import { Chip, Modal } from "react-native-paper";
import { colors } from "../theme/colors";
import { useEffect, useState } from "react";
import DashedButton from "./Core/DashedButton";
import { useTranslate } from "../hooks/useTranslations";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

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
  const t = useTranslate();
  const { _ } = useLingui();

  const [tempSelected, setTempSelected] = useState(selected);

  useEffect(() => {
    if (visible) setTempSelected(selected);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} onDismiss={() => onClose(tempSelected)}>
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
                {t(item.name)}
              </Chip>
            );
          })}
        </View>

        <DashedButton
          title={_(msg`Close`)}
          color={colors.purple}
          background={colors.offWhite}
          style={{ alignSelf: "center", marginTop: 20 }}
          size={{ paddingHorizontal: 30 }}
          onPress={() => onClose(tempSelected)}
          accessibilityLabel={_(msg`Close meal types and categories`)}
        />
      </View>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    padding: 40,
    borderWidth: 2,
    borderColor: colors.lightBrown,
    borderRadius: 25,
    maxWidth: "90%",
    alignSelf: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
    backgroundColor: colors.orange,
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
