// components/Core/ConfirmModal.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";
import DashedButton from "./DashedButton";
import { colors } from "../../theme/colors";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  itemName?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onDismiss,
  itemName,
}) => {
  const { _ } = useLingui();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          <Trans>Are you sure you want to delete</Trans>
          {itemName ? ` "${itemName}"?` : "?"}
        </Text>
        <View style={styles.buttons}>
          <DashedButton
            title={_(msg`Cancel`)}
            color={colors.darkOrange}
            background={colors.offWhite}
            onPress={onDismiss}
            accessibilityLabel={_(msg`Cancel deletion`)}
          />
          <DashedButton
            title={_(msg`Delete`)}
            color={colors.purple}
            background={colors.offWhite}
            onPress={onConfirm}
            accessibilityLabel={_(msg`Confirm deletion`)}
          />
        </View>
      </Modal>
    </Portal>
  );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    marginHorizontal: 40,
    padding: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.lightBrown,
  },
  title: {
    fontSize: 16,
    color: colors.darkBrown,
    fontFamily: "ShantellSans-SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
