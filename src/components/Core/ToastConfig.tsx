import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../theme/colors";

export const toastConfig = {
  success: ({ text1 }: any) => (
    <View
      style={{
        backgroundColor: colors.offWhite,
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.lightBrown,
        marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          color: colors.darkBrown,
          fontFamily: "ShantellSans-SemiBold",
        }}
      >
        {text1}
      </Text>
    </View>
  ),
  error: ({ text1 }: any) => (
    <View
      style={{
        backgroundColor: colors.red,
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.lightBrown,
        marginHorizontal: 20,
      }}
    >
      <Text
        style={{
          color: colors.darkBrown,
          fontFamily: "ShantellSans-SemiBold",
        }}
      >
        {text1}
      </Text>
    </View>
  ),
};
