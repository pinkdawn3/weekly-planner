import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export const PaperProvider = ({ children }: any) => <View>{children}</View>;
export const Chip = ({ children, onPress }: any) => (
  <Pressable onPress={onPress}>
    <Text>{children}</Text>
  </Pressable>
);
export const HelperText = ({ children }: any) => <Text>{children}</Text>;
export const Searchbar = ({ placeholder, onChangeText, value }: any) => (
  <TextInput
    placeholder={placeholder}
    onChangeText={onChangeText}
    value={value}
  />
);
export const Modal = ({ children, visible }: any) =>
  visible ? <View>{children}</View> : null;
export const Portal = ({ children }: any) => <View>{children}</View>;
