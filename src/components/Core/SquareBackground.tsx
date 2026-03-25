import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { StyleSheet } from "react-native";
import { useColors } from "../../theme/useColors";

const SquareBackground = () => {
  const colors = useColors();

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
          {/* Background */}
          <Rect width="25" height="25" fill={colors.backgroundSVG} />
          {/* Horizontal lines */}
          <Line
            x1="0"
            y1="0"
            x2="25"
            y2="0"
            stroke={colors.accent}
            strokeWidth="2.5"
            opacity={0.5}
          />
          {/* Vertical lines */}
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2="25"
            stroke={colors.accent}
            opacity={0.5}
            strokeWidth="2.5"
          />
        </Pattern>
      </Defs>

      <Rect width="100%" height="100%" fill="url(#grid)" opacity={1} />
    </Svg>
  );
};

export default SquareBackground;
