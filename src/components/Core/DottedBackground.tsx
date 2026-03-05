import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Svg, { Defs, Pattern, Rect, Circle } from "react-native-svg";
import { colors } from "../../theme/colors";

interface DottedBackgroundProps {
  style?: StyleProp<ViewStyle>;
}
const DottedBackground = ({ style }: DottedBackgroundProps) => {
  return (
    <Svg style={[StyleSheet.absoluteFill, style]}>
      <Defs>
        <Pattern
          id="dots"
          width="35"
          height="35"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <Rect width="35" height="35" fill={colors.yellow} opacity={0.8} />
          <Circle cx="10" cy="10" r="5" fill={colors.orange} opacity={0.4} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dots)" />
    </Svg>
  );
};

export default DottedBackground;
