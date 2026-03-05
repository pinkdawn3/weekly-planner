import {
  Pressable,
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";

interface DashedButtonProps {
  title: string;
  onPress: () => void;
  color: string;
  background: string;
  size?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const DashedButton = ({
  title,
  onPress,
  color,
  background,
  size,
  style,
}: DashedButtonProps) => {
  return (
    <View style={[styles.button, style, { backgroundColor: color }]}>
      <Pressable
        style={[
          styles.innerButton,
          size,
          { borderColor: background, backgroundColor: color },
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default DashedButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 20,
    padding: 4,
  },
  innerButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 17,
    borderWidth: 3,
    borderStyle: "dashed",
  },
  buttonText: {
    fontFamily: "ShantellSans-Regular",
    color: colors.darkBrown,
  },
});
