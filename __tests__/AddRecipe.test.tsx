import React from "react";
import { Text } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";
import AddRecipe from "../src/screens/AddRecipe";
import { renderWithProviders } from "./helpers/renderWithProviders";

jest.mock("../src/services/db/database.service", () => ({
  createRecipe: jest.fn(),
  getAllRecipes: jest.fn(() => []),
}));

jest.mock("../src/hooks/useTranslations", () => ({
  useTranslate: () => (text: string) => text,
}));

jest.mock("../src/components/Core/DashedButton", () => {
  const { Pressable, Text } = require("react-native");
  return ({ title, onPress }: any) => (
    <Pressable onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
});

jest.mock("react-native-paper", () => {
  const { View, Text, TextInput, Pressable } = require("react-native");
  return {
    PaperProvider: ({ children }: any) => <View>{children}</View>,
    Chip: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    HelperText: ({ children }: any) => <Text>{children}</Text>,
    Searchbar: ({ placeholder, onChangeText, value }: any) => (
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
      />
    ),
    Modal: ({ children, visible }: any) =>
      visible ? <View>{children}</View> : null,
    Portal: ({ children }: any) => <View>{children}</View>,
  };
});

describe("AddRecipe", () => {
  console.log("AddRecipe:", AddRecipe);

  it("renders", () => {
    const { getByText } = renderWithProviders(<Text>Test</Text>);
    expect(getByText("Test")).toBeTruthy();
  });

  it("renders correctly", () => {
    const result = renderWithProviders(<AddRecipe />);
    console.log(result.toJSON());
  });

  it("renders correctly", () => {
    const { getByPlaceholderText } = renderWithProviders(<AddRecipe />);
    expect(getByPlaceholderText("Add name...")).toBeTruthy();
  });

  it("shows error when submitting without name", async () => {
    const { getByText } = renderWithProviders(<AddRecipe />);
    fireEvent.press(getByText("Add"));
    await waitFor(() => {
      expect(getByText("This field is required.")).toBeTruthy();
    });
  });

  it("can add an ingredient", async () => {
    const { getByText, getAllByPlaceholderText } = renderWithProviders(
      <AddRecipe />,
    );
    fireEvent.press(getByText("Add ingredient"));
    await waitFor(() => {
      expect(getAllByPlaceholderText("Add ingredient...")).toHaveLength(1);
    });
  });
});
