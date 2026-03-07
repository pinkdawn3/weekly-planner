// __mocks__/react-native-safe-area-context.tsx
import React from "react";
import { View } from "react-native";

const SafeAreaProviderContext = React.createContext({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const SafeAreaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SafeAreaProviderContext.Provider
    value={{ top: 0, bottom: 0, left: 0, right: 0 }}
  >
    {children}
  </SafeAreaProviderContext.Provider>
);

export const SafeAreaView = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
export const SafeAreaInsetsContext = SafeAreaProviderContext;
